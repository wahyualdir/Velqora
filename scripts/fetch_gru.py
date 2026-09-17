import urllib.request
import re

# Fetch arXiv abstract for Cho et al. GRU (1406.1078)
url_gru = "https://export.arxiv.org/api/query?id_list=1406.1078"
req = urllib.request.Request(url_gru, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        xml_content = resp.read().decode('utf-8')
        summary = re.search(r'<summary>(.*?)</summary>', xml_content, re.DOTALL)
        if summary:
            print("=== GRU / CHO ET AL. ABSTRACT ===")
            print(summary.group(1).strip())
except Exception as e:
    print("GRU fetch error:", e)

# Fetch arXiv abstract for AlexNet / Krizhevsky 2012 citation or text
# Let's also fetch Bahdanau et al. (1409.0473)
url_bahdanau = "https://export.arxiv.org/api/query?id_list=1409.0473"
req = urllib.request.Request(url_bahdanau, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        xml_content = resp.read().decode('utf-8')
        summary = re.search(r'<summary>(.*?)</summary>', xml_content, re.DOTALL)
        if summary:
            print("\n=== BAHDANAU ATTENTION ABSTRACT ===")
            print(summary.group(1).strip())
except Exception as e:
    print("Bahdanau fetch error:", e)
