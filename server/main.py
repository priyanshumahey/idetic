from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from utils.process import process_handler, process_all
from utils.search import search_handler

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://idetic.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Process all unprocessed video files
process_all()


class FileItem(BaseModel):
    video_id: str

class SearchItem(BaseModel):
    search_string: str


@app.get("/")
def read_root():
    return {"Hello": "World"}

# given file id, I need to process
@app.post("/process")
def process(file_item: FileItem):
    process_handler(file_item.video_id)
    return {"Response": "Success"}


@app.post("/search")
def search(search_item: SearchItem):
    print(search_item.search_string)
    results = search_handler(search_item.search_string)
    results = [{
        "videoId": search_result["videoId"],
        "timeStamp": search_result["timeStamp"],
        "isText": search_result["isText"],
        "score": search_result["_score"]
    } for search_result in results ]
    print(results)
    return results
