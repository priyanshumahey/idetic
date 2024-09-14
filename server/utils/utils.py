import os
import subprocess
from transformers import AutoTokenizer, AutoModel, AutoProcessor
import cv2
from PIL import Image
import torch
import numpy as np


def split_audio(input_file, output_dir, chunk_length=10):
    # Get the filename without the extension and directory
    filename, ext = os.path.splitext(os.path.basename(input_file))
    
    # Create an output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Run ffmpeg command to split the audio into chunks
    ffmpeg_command = [
        'ffmpeg', 
        '-i', input_file,               # Input file
        '-f', 'segment',                # Format as segments
        '-segment_time', str(chunk_length), # Split by this duration (in seconds)
        '-c', 'copy',                   # Copy codec to avoid re-encoding
        os.path.join(output_dir, f"{filename}_%03d{ext}") # Output file format
    ]
    
    try:
        subprocess.run(ffmpeg_command, check=True)
        print(f"Audio file successfully split into chunks in '{output_dir}'")
    except subprocess.CalledProcessError as e:
        print(f"Error splitting audio file: {e}")

model = AutoModel.from_pretrained("google/siglip-base-patch16-224")
tokenizer = AutoTokenizer.from_pretrained("google/siglip-base-patch16-224")
processor = AutoProcessor.from_pretrained("google/siglip-base-patch16-224")


def get_images(video_path):
    # Load the video
    video_capture = cv2.VideoCapture(video_path)
    
    # Get the video's frames per second (fps)
    fps = video_capture.get(cv2.CAP_PROP_FPS)
    
    # Check if video loaded correctly
    if not video_capture.isOpened():
        print(f"Error: Could not open video {video_path}")
        return

    # Frame counter
    frame_number = 0
    success, frame = video_capture.read()

    images = []

    while success:
        # Save one frame every second
        if frame_number % int(fps) == 0:
            # Convert the frame (numpy array) to PIL Image for saving
            pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            images.append(pil_image)
        
        # Read the next frame
        success, frame = video_capture.read()
        frame_number += 1
    
    video_capture.release()
    return images

def embed_images(images, batch_size=64):
    embeddings = None

    for i in range(0, len(images), batch_size):
        inputs = processor(images=images[i:i + batch_size], return_tensors="pt")

        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
        
        if embeddings is None:
            embeddings = image_features
        else:
            embeddings = torch.cat((embeddings, image_features), dim=0)
    
    return embeddings

def embed_video(video_path):
    images = get_images(video_path)
    return embed_images(images)

def embed_text(text):
    inputs = tokenizer([text], padding="max_length", return_tensors="pt")
    with torch.no_grad():
        text_embedding = model.get_text_features(**inputs)[0]
    
    return text_embedding

# use this function if you want to embed multiple pieces of text at the same time
# paralellizes things a little more
def embed_text_chunks(chunks, batch_size=64):
    embeddings = None

    for i in range(0, len(chunks), batch_size):
        inputs = tokenizer(chunks[i:i + batch_size], padding="max_length", return_tensors="pt")

        with torch.no_grad():
            image_features = model.get_text_features(**inputs)
        
        if embeddings is None:
            embeddings = image_features
        else:
            embeddings = torch.cat((embeddings, image_features), dim=0)
    
    return embeddings

def calculate_similarity(a, b):
    dot_product = np.dot(a, b)
    normA = np.linalg.norm(a)
    normB = np.linalg.norm(b)
    sim = dot_product / (normA * normB);
    return sim
