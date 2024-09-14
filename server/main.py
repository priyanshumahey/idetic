from typing import Union
import os

from fastapi import FastAPI
from pydantic import BaseModel
from utils import transcribe

import ffmpeg
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)



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
    if not os.path.exists(f'data/processed/{file_name}'):
        os.mkdir(f'data/processed/{file_name}')

    audio_file_path = f'data/processed/{file_name}/{file_name}.mp3'
    ffmpeg.input(f'data/unprocessed/{file_item.path}').output(audio_file_path, acodec='mp3', ar=16000).run()

    with open(audio_file_path, "rb") as file:
        # Create a transcription of the audio file
        transcription = client.audio.transcriptions.create(
          file=(audio_file_path, file.read()), # Required audio file
          model="distil-whisper-large-v3-en", # Required model to use for transcription
          prompt="Specify context or spelling",  # Optional
          response_format="json",  # Optional
          language="en",  # Optional
          temperature=0.0  # Optional
        )
        # Print the transcription text
        print(transcription.text)


    return {"Response": "Success"}



