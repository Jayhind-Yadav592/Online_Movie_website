from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import Subscription
from .serializers import SubscriptionSerializer, PaymentCheckoutSerializer

class SubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentCheckoutSerializer(data=request.data)
        if serializer.is_valid():
            plan = serializer.validated_data['plan']
            card_token = serializer.validated_data['card_token']
            
            # MOCK PAYMENT GATEWAY LOGIC (Stripe/Razorpay)
            # In production, we would initialize Stripe SDK here:
            # stripe.Charge.create(amount=..., source=card_token)
            
            # Simulate successful payment
            payment_ref = f"txn_{uuid.uuid4().hex[:16]}"
            end_date = timezone.now() + timedelta(days=30)
            
            sub, created = Subscription.objects.update_or_create(
                user=request.user,
                defaults={
                    'plan': plan,
                    'status': 'ACTIVE',
                    'end_date': end_date,
                    'payment_reference': payment_ref
                }
            )
            
            return Response({
                "message": "Payment successful!",
                "subscription": SubscriptionSerializer(sub).data
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
