import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import httpx

DJANGO_API_URL = "http://127.0.0.1:8000/api"

class ContentBasedRecommender:
    def __init__(self):
        self.movies_df = None
        self.cosine_sim_matrix = None
        
    def fetch_data_from_django(self):
        """Fetches the latest movie catalogue from the Django monolith to train the ML model."""
        try:
            # We fetch all movies to build the corpus
            response = httpx.get(f"{DJANGO_API_URL}/movies/")
            if response.status_code == 200:
                movies = response.json().get('results', [])
                if not movies:
                    return False
                    
                # Transform into DataFrame
                self.movies_df = pd.DataFrame(movies)
                
                # Create a composite text feature for TF-IDF
                # Combining title, genres, and description
                def create_soup(x):
                    genres = " ".join([g['name'] for g in x.get('genres', [])])
                    return f"{x['title']} {genres} {x.get('description', '')}"
                
                self.movies_df['soup'] = self.movies_df.apply(create_soup, axis=1)
                return True
            return False
        except Exception as e:
            print(f"Failed to fetch data from Django: {e}")
            return False

    def train_model(self):
        """Trains the TF-IDF Vectorizer and calculates the Cosine Similarity Matrix."""
        if self.movies_df is None or self.movies_df.empty:
            if not self.fetch_data_from_django():
                print("No data available to train model.")
                return False

        print("Training ML Recommender...")
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.movies_df['soup'])
        
        # Compute cosine similarity
        self.cosine_sim_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
        print("ML Model trained successfully!")
        return True

    def get_recommendations(self, movie_slug: str, top_n: int = 5):
        """Returns top_n similar movies based on the input movie_slug."""
        if self.cosine_sim_matrix is None:
            self.train_model()
            
        if self.movies_df is None or self.movies_df.empty:
            return []

        try:
            # Get index of the movie that matches the slug
            idx = self.movies_df.index[self.movies_df['slug'] == movie_slug].tolist()[0]
            
            # Get pairwise similarity scores
            sim_scores = list(enumerate(self.cosine_sim_matrix[idx]))
            
            # Sort movies based on similarity scores
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            
            # Get the scores of the top_n most similar movies (ignoring itself)
            sim_scores = sim_scores[1:top_n+1]
            
            # Get movie indices
            movie_indices = [i[0] for i in sim_scores]
            
            # Return the top_n most similar movies
            recommended = self.movies_df.iloc[movie_indices]
            
            # Format output
            return recommended[['id', 'title', 'slug', 'poster', 'rating']].to_dict('records')
            
        except IndexError:
            return [] # Movie not found

# Global singleton instance
recommender_engine = ContentBasedRecommender()
