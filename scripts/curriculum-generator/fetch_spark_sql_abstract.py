import urllib.request
import json

url = "https://api.semanticscholar.org/graph/v1/paper/10.1145/2723372.2742797?fields=title,abstract,authors,year"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print("Title:", data.get("title"))
        print("Abstract:", data.get("abstract"))
except Exception as e:
    print("Error:", e)
