from rest_framework import serializers
from .models import Movie, Genre, Language, CastMember

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class CastMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CastMember
        fields = '__all__'

class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)
    poster = serializers.SerializerMethodField()
    backdrop = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'title', 'slug', 'poster', 'backdrop', 'release_date', 'runtime', 'rating', 'language', 'genres', 'featured', 'trending', 'certification']

    def get_poster(self, obj):
        if obj.poster:
            if str(obj.poster).startswith('http'):
                return str(obj.poster)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return obj.poster.url
        return None

    def get_backdrop(self, obj):
        if obj.backdrop:
            if str(obj.backdrop).startswith('http'):
                return str(obj.backdrop)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.backdrop.url)
            return obj.backdrop.url
        return None

class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)
    cast = CastMemberSerializer(many=True, read_only=True)
    poster = serializers.SerializerMethodField()
    backdrop = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = '__all__'

    def get_poster(self, obj):
        if obj.poster:
            if str(obj.poster).startswith('http'):
                return str(obj.poster)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return obj.poster.url
        return None

    def get_backdrop(self, obj):
        if obj.backdrop:
            if str(obj.backdrop).startswith('http'):
                return str(obj.backdrop)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.backdrop.url)
            return obj.backdrop.url
        return None
