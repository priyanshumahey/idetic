from typing import Union
import os

from fastapi import FastAPI
from pydantic import BaseModel
from utils import transcribe

import ffmpeg
from dotenv import load_dotenv

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
    if not os.path.exists(f'data/processed/{file_name}'):
        os.mkdir(f'data/processed/{file_name}')

    audio_file_path = f'data/processed/{file_name}/{file_name}.wav'
    ffmpeg.input(f'data/unprocessed/{file_item.path}').output(audio_file_path, ar=16000, ac=1, acodec='pcm_s16le').run()




    return {"Response": "Success"}



