import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from movies.models import Movie, Genre, Language

def seed():
    print("Clearing old data...")
    Movie.objects.all().delete()
    Genre.objects.all().delete()
    Language.objects.all().delete()
    
    print("Creating languages...")
    en = Language.objects.create(name="English", code="en")
    hi = Language.objects.create(name="Hindi", code="hi")
    
    print("Creating genres...")
    action = Genre.objects.create(name="Action", slug="action")
    scifi = Genre.objects.create(name="Sci-Fi", slug="sci-fi")
    comedy = Genre.objects.create(name="Comedy", slug="comedy")
    drama = Genre.objects.create(name="Drama", slug="drama")
    thriller = Genre.objects.create(name="Thriller", slug="thriller")
    
    # Real movie data using TMDB images
    movies_data = [
        {
            "title": "Interstellar",
            "description": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
            "poster": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80",
            "genres": [scifi, drama],
            "rating": 8.6,
            "release_date": date(2014, 11, 5),
            "featured": True
        },
        {
            "title": "The Dark Knight",
            "description": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
            "poster": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1920&q=80",
            "genres": [action, thriller],
            "rating": 9.0,
            "release_date": date(2008, 7, 18),
            "featured": False
        },
        {
            "title": "Inception",
            "description": "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
            "poster": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
            "genres": [action, scifi, thriller],
            "rating": 8.8,
            "release_date": date(2010, 7, 15),
            "featured": False
        },
        {
            "title": "Avatar: The Way of Water",
            "description": "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe.",
            "poster": "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?w=1920&q=80",
            "genres": [action, scifi],
            "rating": 7.6,
            "release_date": date(2022, 12, 14),
            "featured": False
        },
        {
            "title": "The Avengers",
            "description": "When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster.",
            "poster": "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=1920&q=80",
            "genres": [action, scifi],
            "rating": 8.0,
            "release_date": date(2012, 4, 25),
            "featured": False
        },
        {
            "title": "Dune: Part Two",
            "description": "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
            "poster": "https://images.unsplash.com/photo-1547333590-bc73734d86b8?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1547333590-bc73734d86b8?w=1920&q=80",
            "genres": [scifi, action, drama],
            "rating": 8.3,
            "release_date": date(2024, 2, 27),
            "featured": False
        },
        {
            "title": "Jawan",
            "description": "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
            "poster": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80",
            "genres": [action, thriller],
            "rating": 7.1,
            "release_date": date(2023, 9, 7),
            "featured": False
        },
        {
            "title": "Deadpool & Wolverine",
            "description": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.",
            "poster": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80",
            "backdrop": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&q=80",
            "genres": [action, comedy, scifi],
            "rating": 7.7,
            "release_date": date(2024, 7, 24),
            "featured": True
        }
    ]

    print("Creating movies...")
    for item in movies_data:
        movie = Movie.objects.create(
            title=item['title'],
            description=item['description'],
            poster=item['poster'],
            backdrop=item['backdrop'],
            video_url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
            release_date=item['release_date'],
            runtime=120,
            rating=item['rating'],
            language=en if item['title'] != 'Jawan' else hi,
            certification="PG-13",
            featured=item['featured'],
            trending=True,
        )
        movie.genres.add(*item['genres'])

    print("Data seeded successfully!")

if __name__ == '__main__':
    seed()
