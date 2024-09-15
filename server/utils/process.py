from typing import Union
import os
import subprocess

from utils.file_transfer import download_video
from utils.utils import split_audio, embed_text_chunks, embed_text, embed_video

import ffmpeg
from dotenv import load_dotenv
import subprocess

load_dotenv()

def process_handler(uuid: str):
    print(os.listdir("data/unprocessed"))

    # Extract audio from video and convert to WAV
    os.makedirs(f'data/processed/{uuid}', exist_ok=True)
    os.makedirs(f'data/unprocessed', exist_ok=True)

    video_file_path = f'data/unprocessed/{uuid}'
    download_video(uuid, video_file_path)
    audio_file_path = f'data/processed/{uuid}/{uuid}.wav'
    ffmpeg.input(video_file_path).output(audio_file_path, ar=16000, ac=1, acodec='pcm_s16le').run()

    output_chunk_dir = f"data/processed/{uuid}/{uuid}_chunks"

    split_audio(audio_file_path, output_chunk_dir, 10)

    text_files = []

    for file in os.listdir(output_chunk_dir):
        result = subprocess.run(["./transcribe.sh", output_chunk_dir, file], capture_output=True, text=True)
        text_files.append(f"{output_chunk_dir}/{file}.txt")


    embedding_input = [] 
    for text_file in text_files:
        with open(text_file, 'r') as tf:
            embed_input_str = tf.read()
            embedding_input.append(embed_input_str)
        pass

    embeddings = embed_text_chunks(embedding_input)
    video_embeddings = embed_video(audio_file_path)

    mega_embedding = []

    for i, el in enumerate(video_embeddings):
        embedding = {
            "isText": False,
            "embedding": el,
            "ts": i
        }
        mega_embedding.append(embedding)

    for i, el in enumerate(embeddings):
        embedding = {
            "embedding": el,
            "isText": True,
            "timeStamp": i*10,
            "videoId": ""

        }
        mega_embedding.append(embedding)
        
    print(mega_embedding)


