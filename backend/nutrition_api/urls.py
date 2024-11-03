# backend/nutrition_api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("api/v1/nutrition/", views.NutritionFacts, name="nutrition"),
    path("api/v1/user-nutrition/", views.user_nutrition_data, name="user-nutrition"),
]
