from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'plan', 'status', 'start_date', 'end_date']
        read_only_fields = ['id', 'status', 'start_date', 'end_date']

class PaymentCheckoutSerializer(serializers.Serializer):
    plan = serializers.ChoiceField(choices=['MOBILE', 'BASIC', 'STANDARD', 'PREMIUM'])
    card_token = serializers.CharField(max_length=255)
