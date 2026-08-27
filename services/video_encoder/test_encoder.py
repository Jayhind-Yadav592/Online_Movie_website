import requests

# Assuming the service is running on 8001
url = "http://127.0.0.1:8001/api/v1/encode/"

# We will just upload this python script as a mock 'video.mp4' to test the endpoint
files = {'file': ('test_video.mp4', open('main.py', 'rb'), 'video/mp4')}

try:
    response = requests.post(url, files=files)
    print("Response:", response.status_code)
    print(response.json())
except Exception as e:
    print("Error:", e)
