import os
import django
import urllib.request

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie
from django.core.files.base import ContentFile
import urllib.error

def download_images():
    print("Downloading images locally...")
    
    # Ensure media directories exist
    os.makedirs('media/movie_posters', exist_ok=True)
    os.makedirs('media/movie_backdrops', exist_ok=True)

    movies = Movie.objects.all()
    for movie in movies:
        # Download Poster
        if str(movie.poster).startswith('http'):
            print(f"Downloading poster for {movie.title}...")
            try:
                req = urllib.request.Request(str(movie.poster), headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    content = response.read()
                    movie.poster.save(f"{movie.slug}_poster.jpg", ContentFile(content), save=False)
            except Exception as e:
                print(f"Error downloading poster: {e}")
                
        # Download Backdrop
        if str(movie.backdrop).startswith('http'):
            print(f"Downloading backdrop for {movie.title}...")
            try:
                req = urllib.request.Request(str(movie.backdrop), headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    content = response.read()
                    movie.backdrop.save(f"{movie.slug}_backdrop.jpg", ContentFile(content), save=False)
            except Exception as e:
                print(f"Error downloading backdrop: {e}")
                
        movie.save()

    print("All images downloaded and saved locally!")

if __name__ == '__main__':
    download_images()
