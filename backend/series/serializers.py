from rest_framework import serializers
from .models import Series, Season, Episode
from movies.serializers import GenreSerializer, LanguageSerializer, CastMemberSerializer

class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = '__all__'

class SeasonSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True, read_only=True)

    class Meta:
        model = Season
        fields = '__all__'

class SeriesListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)

    class Meta:
        model = Series
        fields = ['id', 'title', 'slug', 'poster', 'backdrop', 'release_date', 'language', 'genres']

class SeriesDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)
    cast = CastMemberSerializer(many=True, read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)

    class Meta:
        model = Series
        fields = '__all__'
