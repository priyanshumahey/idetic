import os
from dotenv import load_dotenv
from convex import ConvexClient
import requests
import torch

load_dotenv(".env.local")
load_dotenv()

client = ConvexClient(os.getenv("CONVEX_URL"))

def download_from_url(url, output_path):
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Raise an exception for bad status codes

    # Open the output file in binary mode
    with open(output_path, 'wb') as file:
        # Download the file in chunks
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                file.write(chunk)

    print(f"Video downloaded successfully to {output_path}")


def download_video(videoId, output_path):
    result = client.query("videos:getVideoUrl", args={'videoId': videoId})[0]
    url = result['url']

    download_from_url(url, output_path)

def grab_all_vid_ids():
    results = client.query("videos:get")
    return [vid['body'] for vid in results]

def upload_list(embedding_list):
    # just convert our torch tensors to python lists to upload
    upload_list = [
        {
            "embedding": embedding_obj['embedding'].tolist(),
            "isText": embedding_obj['isText'],
            "timeStamp": embedding_obj['timeStamp'],
            "videoId": embedding_obj['videoId']
        } for embedding_obj in embedding_list
    ]

    client.mutation("frameEmbedding:uploadEmbeddings", args={'embeddingList': upload_list})


if __name__ == "__main__":
    ids = grab_all_vid_ids()
    print(ids)
    upload_list([
        {
            'embedding': torch.zeros(768),
            'videoId': "kg222tv5nwhmf76v8b5qht0xx570svj2",
            'timeStamp': int(1),
            'isText': False
        },
        {
            'embedding': torch.ones(768),
            'videoId': "kg222tv5nwhmf76v8b5qht0xx570svj2",
            'timeStamp': int(2),
            'isText': False
        },
        {
            'embedding': torch.zeros(768),
            'videoId': "kg222tv5nwhmf76v8b5qht0xx570svj2",
            'timeStamp': int(3),
            'isText': False
        }
    ])
    # download_video("kg222tv5nwhmf76v8b5qht0xx570svj2", './test.mp4')
