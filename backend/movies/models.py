from django.db import models
from django.utils.text import slugify

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Language(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class CastMember(models.Model):
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='cast_photos/', null=True, blank=True)
    biography = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    poster = models.ImageField(upload_to='movie_posters/')
    backdrop = models.ImageField(upload_to='movie_backdrops/')
    trailer_url = models.URLField(max_length=500, null=True, blank=True)
    video_url = models.URLField(max_length=500)
    release_date = models.DateField()
    runtime = models.IntegerField(help_text="Runtime in minutes")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    genres = models.ManyToManyField(Genre, related_name='movies')
    cast = models.ManyToManyField(CastMember, related_name='movies', blank=True)
    director = models.CharField(max_length=255, null=True, blank=True)
    certification = models.CharField(max_length=50, null=True, blank=True)
    
    featured = models.BooleanField(default=False)
    trending = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
