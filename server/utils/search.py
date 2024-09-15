from utils.file_transfer import client
from utils.embedding import embed_text

def search(query):
    query_embed = embed_text(query).tolist()
    results = search_with_embed(query_embed)
    return results

def search_with_embed(embed):
    results = client.action('frameEmbedding:search', args={"embedding": embed})
    print(results)
    return results

if __name__ == "__main__":
    search_with_embed([1] * 768)
