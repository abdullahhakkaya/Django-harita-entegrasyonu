from django.shortcuts import render
from django.db import models
from django.contrib.auth.models import AbstractUser
from geopy.geocoders import Nominatim

class User(AbstractUser):
    ROLE_CHOICES = [
        ('Volunteer', 'Gönüllü'),
        ('Leader', 'Lider'),
        ('Admin', 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='Volunteer')
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(unique=True)
    profile_photo = models.ImageField(upload_to='profile/', null=True, blank=True)
    bio = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    REQUIRED_FIELDS = ['email', 'phone_number', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Event(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    participants = models.ManyToManyField(User, related_name='joined_events', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_completed = models.BooleanField(default=False)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    def __str__(self):
        return self.title

    @property
    def get_location_names(self):
        if self.latitude is not None and self.longitude is not None:
            geolocator = Nominatim(user_agent="birliktetemiziz_app")
            location = geolocator.reverse((self.latitude, self.longitude), language='tr')
            if location:
                address = location.raw.get('address', {})
                semt = address.get('suburb') or address.get('neighbourhood') or ''
                ilce = address.get('county') or ''
                il = address.get('state') or ''
                return semt, ilce, il
        return None, None, None
    