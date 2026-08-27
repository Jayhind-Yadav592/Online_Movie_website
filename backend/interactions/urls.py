from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WatchlistViewSet, WatchHistoryViewSet, ReviewViewSet, SearchHistoryViewSet

router = DefaultRouter()
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')
router.register(r'history', WatchHistoryViewSet, basename='watchhistory')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'search-history', SearchHistoryViewSet, basename='searchhistory')

urlpatterns = [
    path('user/', include(router.urls)),
]
