import urllib.request
import re

try:
    req = urllib.request.Request('https://www.netflix.com/in/', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = re.findall(r'https://assets.nflxext.com[^\'"]+', html)
    for url in list(set(urls)):
        if 'jpg' in url or 'png' in url or 'webp' in url:
            print(url)
except Exception as e:
    print(e)
