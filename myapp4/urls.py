from django.urls import path
from .views import get_ticketmaster_data, liked_page_view

urlpatterns = [
    path('get_ticketmaster_data/', get_ticketmaster_data, name='get_ticketmaster_data'),
    path('liked/', liked_page_view, name='liked_page'),

]
