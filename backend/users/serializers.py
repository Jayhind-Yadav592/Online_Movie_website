from rest_framework import serializers
from django.contrib.auth import get_user_model
from subscriptions.models import Subscription
from .models import Profile

User = get_user_model()

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['plan', 'status', 'start_date', 'end_date']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'name', 'avatar', 'is_kids', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)
    profiles = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'avatar', 'role', 'subscription', 'profiles']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Create default free subscription
        Subscription.objects.create(user=user, plan='FREE', status='ACTIVE')
        return user
