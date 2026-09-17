import urllib.request
import json
import re

# Fetch arXiv abstract for ResNet (1512.03385)
url_resnet = "https://export.arxiv.org/api/query?id_list=1512.03385"
req = urllib.request.Request(url_resnet, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        xml_content = resp.read().decode('utf-8')
        summary = re.search(r'<summary>(.*?)</summary>', xml_content, re.DOTALL)
        if summary:
            print("=== RESNET ABSTRACT ===")
            print(summary.group(1).strip())
except Exception as e:
    print("ResNet fetch error:", e)

# Fetch arXiv abstract for U-Net (1505.04597)
url_unet = "https://export.arxiv.org/api/query?id_list=1505.04597"
req = urllib.request.Request(url_unet, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        xml_content = resp.read().decode('utf-8')
        summary = re.search(r'<summary>(.*?)</summary>', xml_content, re.DOTALL)
        if summary:
            print("\n=== U-NET ABSTRACT ===")
            print(summary.group(1).strip())
except Exception as e:
    print("U-Net fetch error:", e)

# Fetch arXiv abstract for Faster R-CNN (1506.01497)
url_faster = "https://export.arxiv.org/api/query?id_list=1506.01497"
req = urllib.request.Request(url_faster, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        xml_content = resp.read().decode('utf-8')
        summary = re.search(r'<summary>(.*?)</summary>', xml_content, re.DOTALL)
        if summary:
            print("\n=== FASTER R-CNN ABSTRACT ===")
            print(summary.group(1).strip())
except Exception as e:
    print("Faster R-CNN fetch error:", e)
