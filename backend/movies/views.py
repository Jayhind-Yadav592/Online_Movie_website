from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Movie, Genre, Language
from .serializers import MovieListSerializer, MovieDetailSerializer, GenreSerializer, LanguageSerializer

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.filter(published=True).order_by('-release_date')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genres__slug', 'language__code', 'release_date']
    search_fields = ['title', 'director', 'cast__name']
    ordering_fields = ['release_date', 'rating', 'title']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return MovieListSerializer
        return MovieDetailSerializer

class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

from rest_framework.views import APIView
from rest_framework.response import Response
from .services.search_service import global_search
from series.serializers import SeriesListSerializer
from .serializers import CastMemberSerializer

class GlobalSearchView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '')
        results = global_search(query)
        
        return Response({
            'query': query,
            'movies': MovieListSerializer(results['movies'], many=True, context={'request': request}).data,
            'series': SeriesListSerializer(results['series'], many=True, context={'request': request}).data,
            'people': CastMemberSerializer(results['people'], many=True, context={'request': request}).data,
            'genres': GenreSerializer(results['genres'], many=True, context={'request': request}).data,
            'languages': LanguageSerializer(results['languages'], many=True, context={'request': request}).data,
            'count': len(results['movies']) + len(results['series']) + len(results['people']) + len(results['genres']) + len(results['languages'])
        })
