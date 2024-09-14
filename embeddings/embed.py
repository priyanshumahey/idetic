from transformers import AutoTokenizer, AutoModel, AutoProcessor
import cv2
from PIL import Image
import torch
from time import clock

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

if __name__ == "__main__":
    file_path = "test.mp4"
    embeddings = embed_video(file_path)
    print(embeddings.shape)
