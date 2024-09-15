import os
import subprocess
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

def calculate_similarity(a, b):
    dot_product = np.dot(a, b)
    normA = np.linalg.norm(a)
    normB = np.linalg.norm(b)
    sim = dot_product / (normA * normB)
    return sim
