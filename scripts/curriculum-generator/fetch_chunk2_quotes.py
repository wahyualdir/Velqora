# scratch/fetch_chunk2_quotes.py
import urllib.request
import re

def fetch_arxiv_text(arxiv_id):
    url = f"https://arxiv.org/abs/{arxiv_id}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            # Extract abstract
            m = re.search(r'<blockquote class="abstract mathjax">\s*<span class="descriptor">Abstract:</span>\s*(.*?)\s*</blockquote>', html, re.DOTALL)
            if m:
                clean_abstract = re.sub(r'\s+', ' ', m.group(1)).strip()
                return clean_abstract
    except Exception as e:
        return f"Error: {e}"
    return "Not found"

print("Fetching AdamW (1711.05101)...")
print("AdamW Abstract:", fetch_arxiv_text("1711.05101"))

print("\nFetching RMSNorm (1910.07467)...")
print("RMSNorm Abstract:", fetch_arxiv_text("1910.07467"))

print("\nFetching CutMix (1905.04899)...")
print("CutMix Abstract:", fetch_arxiv_text("1905.04899"))
