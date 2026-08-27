from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet, CheckoutView

router = DefaultRouter()
router.register(r'my-subscription', SubscriptionViewSet, basename='my-subscription')

urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
]
