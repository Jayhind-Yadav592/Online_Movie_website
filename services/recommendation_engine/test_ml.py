import requests

url = "http://127.0.0.1:8002/api/v1/recommend/train"
print("Training ML Model...")
res = requests.post(url)
print(res.json())

# Let's get similar movies for Interstellar
url = "http://127.0.0.1:8002/api/v1/recommend/similar/interstellar"
print("\nBecause you watched Interstellar:")
res = requests.get(url)
for movie in res.json().get('results', []):
    print(f"- {movie['title']} (Rating: {movie['rating']})")
