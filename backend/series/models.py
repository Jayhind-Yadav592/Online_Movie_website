from django.db import models
from django.utils.text import slugify
from movies.models import Genre, Language, CastMember

class Series(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    poster = models.ImageField(upload_to='series_posters/')
    backdrop = models.ImageField(upload_to='series_backdrops/')
    trailer_url = models.URLField(max_length=500, null=True, blank=True)
    release_date = models.DateField()
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    genres = models.ManyToManyField(Genre, related_name='series')
    cast = models.ManyToManyField(CastMember, related_name='series', blank=True)
    director = models.CharField(max_length=255, null=True, blank=True)
    
    published = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Season(models.Model):
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='seasons')
    season_number = models.PositiveIntegerField()
    
    class Meta:
        unique_together = ('series', 'season_number')
        ordering = ['season_number']

    def __str__(self):
        return f"{self.series.title} - Season {self.season_number}"

class Episode(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='episodes')
    episode_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='episode_thumbnails/')
    video_url = models.URLField(max_length=500)
    duration = models.IntegerField(help_text="Duration in minutes")
    release_date = models.DateField()
    
    class Meta:
        unique_together = ('season', 'episode_number')
        ordering = ['episode_number']

    def __str__(self):
        return f"{self.season.series.title} - S{self.season.season_number:02d}E{self.episode_number:02d} - {self.title}"
