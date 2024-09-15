from typing import Union
import os
import subprocess

from fastapi import FastAPI
from pydantic import BaseModel
from utils.process import process_handler

import ffmpeg
from dotenv import load_dotenv
import subprocess

load_dotenv()

app = FastAPI()


class FileItem(BaseModel):
    audio_id: str


class SearchItem(BaseModel):
    search_string: str


@app.get("/")
def read_root():
    return {"Hello": "World"}

# given file id, I need to process
@app.post("/process")
def process(file_item: FileItem):
    process_handler(file_item.audio_id)
    return {"Response": "Success"}


@app.post("/search")
def search(search_item: SearchItem):
    #  embedding = embed_text(search_item.search_string)
    pass


# [text1, text3, ...]
# [embed1, embed2, embed, ....]


# {
#     uuid_ts: {
#         text: str
#         embedding: embedding
#         ts: int

#     }
# }


# uuid_ts 
