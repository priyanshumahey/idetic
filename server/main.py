from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from utils.process import process_handler, process_all
from utils.search import search_handler

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
process_all()


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
    print(search_item.search_string)
    results = search_handler(search_item.search_string)
    results = [{
        "videoId": search_result["videoId"],
        "timeStamp": search_result["timeStamp"],
        "isText": search_result["videoId"]
    } for search_result in results ]
    # print(results)
    return results
