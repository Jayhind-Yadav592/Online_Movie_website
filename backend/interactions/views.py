from rest_framework import viewsets, permissions
from .models import Watchlist, WatchHistory, Review, SearchHistory
from .serializers import WatchlistSerializer, WatchHistorySerializer, ReviewSerializer, SearchHistorySerializer

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        movie = serializer.validated_data.get('movie')
        watchlist, created = Watchlist.objects.get_or_create(
            user=self.request.user,
            movie=movie
        )
        serializer.instance = watchlist

class WatchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = WatchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WatchHistory.objects.filter(user=self.request.user).order_by('-last_watched')

    def perform_create(self, serializer):
        movie = serializer.validated_data.get('movie')
        episode = serializer.validated_data.get('episode')
        progress = serializer.validated_data.get('progress_seconds', 0)
        duration = serializer.validated_data.get('duration_seconds', 0)
        completed = serializer.validated_data.get('completed', False)
        
        history, created = WatchHistory.objects.update_or_create(
            user=self.request.user,
            movie=movie,
            episode=episode,
            defaults={
                'progress_seconds': progress,
                'duration_seconds': duration,
                'completed': completed
            }
        )
        serializer.instance = history

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        movie_id = self.request.query_params.get('movie_id')
        queryset = Review.objects.all()
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SearchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)[:10]

    def perform_create(self, serializer):
        # Prevent duplicates
        query = serializer.validated_data.get('query')
        history, created = SearchHistory.objects.update_or_create(
            user=self.request.user,
            query=query,
            defaults={'query': query} # update timestamp via auto_now
        )
        # Note: ModelViewSet's create method will return 201 normally, but we just override perform_create
        # However, update_or_create doesn't return the serializer instance in the way perform_create expects.
        # Actually, perform_create doesn't return anything. It just sets instance on serializer.
        serializer.instance = history
