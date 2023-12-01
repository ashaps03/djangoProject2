# middleware.py

import requests
from django.http import JsonResponse


class ApiProxyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api-proxy/'):
            api_url = 'https://app.ticketmaster.com' + request.path.replace('/api-proxy', '')
            response = requests.get(api_url, params=request.GET)
            return JsonResponse(response.json())  # Use JsonResponse or HttpResponse based on your needs
        return self.get_response(request)
