from django.shortcuts import render
from django.urls import reverse
from map.models import Event
import json

def index(request):
    events = Event.objects.all()
    events_data = [
        {
            'id': e.id,
            'title': e.title,
            'lat': e.latitude,
            'lng': e.longitude,
            'is_completed': e.is_completed,
            'date': e.date.strftime('%d.%m.%Y'),
            'detail_url': reverse('map:home_page'),
        } for e in events if e.latitude and e.longitude
    ]

    user_location = None
    if request.user.is_authenticated and request.user.latitude and request.user.longitude:
        user_location = {
            'lat': request.user.latitude,
            'lng': request.user.longitude
        }

    return render(request, 'map/index.html', {
        'events_json': json.dumps(events_data),
        'user_location': json.dumps(user_location)
    })
