from django.http import JsonResponse
import requests
from django.shortcuts import render

def get_ticketmaster_data(request):
    classification_name = request.GET.get('classificationName')
    city = request.GET.get('city')
    sort = request.GET.get('sort')
    apikey = request.GET.get('apikey')

    url = f'https://app.ticketmaster.com/discovery/v2/events.json?classificationName={classification_name}&city={city}&sort={sort}&apikey={apikey}'
    response = requests.get(url)

    return JsonResponse(response.json())

def liked_page_view(request):
    return render(request, 'liked.html')

