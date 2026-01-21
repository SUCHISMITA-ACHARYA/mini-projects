from django.urls import path
from .views import *

urlpatterns = [
    path('group', group),
    path('expense', expense),
    path('balances/<str:group>/<str:user>', balances),
    path('reset', reset),
]
