import os
import django
import urllib.request
from datetime import date
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie, Genre, Language

def download_image(url, filename):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        content = urllib.request.urlopen(req).read()
        return ContentFile(content, name=filename)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def seed():
    print("Clearing old data for full Netflix replica...")
    Movie.objects.all().delete()
    
    hi, _ = Language.objects.get_or_create(name="Hindi", code="hi")
    te, _ = Language.objects.get_or_create(name="Telugu", code="te")
    ta, _ = Language.objects.get_or_create(name="Tamil", code="ta")
    en, _ = Language.objects.get_or_create(name="English", code="en")
    
    action, _ = Genre.objects.get_or_create(name="Action", slug="action")
    drama, _ = Genre.objects.get_or_create(name="Drama", slug="drama")
    comedy, _ = Genre.objects.get_or_create(name="Comedy", slug="comedy")
    thriller, _ = Genre.objects.get_or_create(name="Thriller", slug="thriller")
    scifi, _ = Genre.objects.get_or_create(name="Sci-Fi", slug="sci-fi")

    netflix_movies = [
        {
            "title": "Kalki 2898 AD",
            "desc": "A modern-day avatar of Vishnu descends to Earth to protect the world from evil forces in a dystopian future.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD_poster.jpg",
            "lang": te, "genres": [action, scifi], "date": date(2024, 6, 27)
        },
        {
            "title": "Maharaja",
            "desc": "A barber seeks vengeance after his home is burglarized, cryptically telling police his 'lakshmi' has been taken.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Maharaja_2024_poster.jpg",
            "lang": ta, "genres": [action, thriller], "date": date(2024, 6, 14)
        },
        {
            "title": "Animal",
            "desc": "The hardened son of a powerful industrialist returns home after years abroad and vows to take blood revenge on those threatening his father.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
            "lang": hi, "genres": [action, drama], "date": date(2023, 12, 1)
        },
        {
            "title": "Dunki",
            "desc": "Four friends from a village in Punjab share a common dream: to go to England. Their problem is that they have neither the visa nor the ticket.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/3/30/Dunki_poster.jpg",
            "lang": hi, "genres": [comedy, drama], "date": date(2023, 12, 21)
        },
        {
            "title": "Salaar",
            "desc": "A gang leader makes a promise to a dying friend by taking on the other criminal gangs.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/4/41/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
            "lang": te, "genres": [action, thriller], "date": date(2023, 12, 22)
        },
        {
            "title": "Crew",
            "desc": "Follows three hard-working women as their destinies lead to some unwarranted situations and they end up caught in a web of lies.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/e/eb/Crew_2024_film_poster.jpg",
            "lang": hi, "genres": [comedy], "date": date(2024, 3, 29)
        },
        {
            "title": "Jawan",
            "desc": "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
            "lang": hi, "genres": [action, thriller], "date": date(2023, 9, 7)
        },
        {
            "title": "Fighter",
            "desc": "Top IAF aviators come together in the face of imminent danger, to form Air Dragons.",
            "poster_url": "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg",
            "lang": hi, "genres": [action], "date": date(2024, 1, 25)
        }
    ]

    print("Creating exact Netflix replica movies...")
    for idx, item in enumerate(netflix_movies):
        print(f"Processing {item['title']}...")
        poster_file = download_image(item['poster_url'], f"{item['title'].replace(' ', '_').lower()}_poster.jpg")
        
        movie = Movie(
            title=item['title'],
            description=item['desc'],
            video_url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
            release_date=item['date'],
            runtime=150,
            rating=8.0 + (idx % 2),
            language=item['lang'],
            featured=(idx == 0),
            trending=True,
        )
        if poster_file:
            movie.poster.save(poster_file.name, poster_file, save=False)
            movie.backdrop.save(poster_file.name, poster_file, save=False) # Use poster as backdrop for now to ensure no broken images
            
        movie.save()
        movie.genres.add(*item['genres'])

    print("Netflix Replica Seed Completed!")

if __name__ == '__main__':
    seed()
