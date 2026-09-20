import urllib.request
import xml.etree.ElementTree as ET

ids = ['1904.09751', '2211.17192', '2306.05685', '2210.03629', '2301.10226', '2401.04088', '2405.21060']
id_param = ','.join(ids)
url = f'https://export.arxiv.org/api/query?id_list={id_param}'
req = urllib.request.Request(url, headers={'User-Agent': 'Python-urllib/3.14 (velqora-curriculum-auditor)'})
resp = urllib.request.urlopen(req)
root = ET.fromstring(resp.read().decode('utf-8'))
for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
    title = entry.find('{http://www.w3.org/2005/Atom}title').text.strip().replace('\n', ' ')
    summary = entry.find('{http://www.w3.org/2005/Atom}summary').text.strip().replace('\n', ' ')
    print(f'=== {title} ===')
    print(summary)
    print()
