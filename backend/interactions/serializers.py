from rest_framework import serializers
from .models import Watchlist, WatchHistory, Review, SearchHistory
from movies.serializers import MovieListSerializer

class WatchlistSerializer(serializers.ModelSerializer):
    movie_details = MovieListSerializer(source='movie', read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'movie', 'movie_details', 'created_at']
        read_only_fields = ['id', 'created_at']

class WatchHistorySerializer(serializers.ModelSerializer):
    movie_details = MovieListSerializer(source='movie', read_only=True)
    
    class Meta:
        model = WatchHistory
        fields = ['id', 'movie', 'episode', 'movie_details', 'progress_seconds', 'duration_seconds', 'completed', 'last_watched']
        read_only_fields = ['id', 'last_watched']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'movie', 'rating', 'review', 'user_name', 'created_at']
        read_only_fields = ['id', 'created_at']

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'timestamp']
        read_only_fields = ['id', 'timestamp']
