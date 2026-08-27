from django.db.models import Q, Value, IntegerField, When, Case
from movies.models import Movie, CastMember, Genre, Language
from series.models import Series

def global_search(query):
    if not query or len(query) < 2:
        return {'movies': [], 'series': [], 'people': [], 'genres': [], 'languages': []}

    q_lower = query.lower()

    # Search Movies
    movie_q = (
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(genres__name__icontains=query) |
        Q(language__name__icontains=query) |
        Q(cast__name__icontains=query) |
        Q(director__icontains=query)
    )
    movies = Movie.objects.filter(movie_q, published=True).distinct().annotate(
        relevance=Case(
            When(title__iexact=query, then=Value(10)),
            When(title__istartswith=query, then=Value(8)),
            When(title__icontains=query, then=Value(6)),
            When(cast__name__icontains=query, then=Value(4)),
            When(director__icontains=query, then=Value(4)),
            default=Value(1),
            output_field=IntegerField(),
        )
    ).order_by('-relevance', '-release_date')[:20]

    # Search Series
    series_q = (
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(genres__name__icontains=query) |
        Q(language__name__icontains=query) |
        Q(cast__name__icontains=query) |
        Q(director__icontains=query)
    )
    series = Series.objects.filter(series_q, published=True).distinct().annotate(
        relevance=Case(
            When(title__iexact=query, then=Value(10)),
            When(title__istartswith=query, then=Value(8)),
            When(title__icontains=query, then=Value(6)),
            When(cast__name__icontains=query, then=Value(4)),
            default=Value(1),
            output_field=IntegerField(),
        )
    ).order_by('-relevance', '-release_date')[:20]

    # Search People (Cast Members)
    people = CastMember.objects.filter(name__icontains=query)[:10]

    # Search Genres
    genres = Genre.objects.filter(name__icontains=query)[:5]

    # Search Languages
    languages = Language.objects.filter(name__icontains=query)[:5]

    return {
        'movies': movies,
        'series': series,
        'people': people,
        'genres': genres,
        'languages': languages
    }
