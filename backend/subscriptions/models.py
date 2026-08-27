from django.db import models
from django.conf import settings

class Subscription(models.Model):
    PLAN_CHOICES = (
        ('FREE', 'Free'),
        ('MOBILE', 'Mobile - ₹149'),
        ('BASIC', 'Basic - ₹199'),
        ('STANDARD', 'Standard - ₹499'),
        ('PREMIUM', 'Premium - ₹649'),
    )
    
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('CANCELLED', 'Cancelled'),
        ('EXPIRED', 'Expired'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription')
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='FREE')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.plan} ({self.status})"
