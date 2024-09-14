from typing import Union
import os
import subprocess

from fastapi import FastAPI
from pydantic import BaseModel
from utils import transcribe

import ffmpeg
from dotenv import load_dotenv
import subprocess

load_dotenv()

app = FastAPI()


class FileItem(BaseModel):
    path: str


@app.get("/")
def read_root():
    return {"Hello": "World"}

# given file id, I need to process
@app.post("/process")
def process(file_item: FileItem):
    print(os.listdir("data/unprocessed"))
    [file_name, file_format] = file_item.path.split('.')

    # Extract audio from video and convert to WAV
    os.makedirs(f'data/processed/{file_name}', exist_ok=True)

    audio_file_path = f'data/processed/{file_name}/{file_name}.wav'
    ffmpeg.input(f'data/unprocessed/{file_item.path}').output(audio_file_path, ar=16000, ac=1, acodec='pcm_s16le').run()

    output_chunk_dir = f"data/processed/{file_name}/{file_name}_chunks"

    split_audio(audio_file_path, output_chunk_dir, 10)

    for file in os.listdir(output_chunk_dir):
        result = subprocess.run(["./transcribe.sh", f"{output_chunk_dir}/{file}"], capture_output=True, text=True)
        print(result)




    # result = subprocess.run(["./transcribe.sh"], capture_output=True, text=True)
    # print(result)




    return {"Response": "Success"}



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
