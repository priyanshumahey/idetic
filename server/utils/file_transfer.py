import os
from dotenv import load_dotenv
from convex import ConvexClient
import requests

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

def process_unprocessed_vids():
    pass

if __name__ == "__main__":
    ids = grab_all_vid_ids()
    print(ids)
    # download_video("kg222tv5nwhmf76v8b5qht0xx570svj2", './test.mp4')
