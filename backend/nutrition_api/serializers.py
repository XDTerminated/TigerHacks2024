# backend/nutrition_api/serializers.py
from rest_framework import serializers
from .models import UserNutritionData


class UserNutritionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNutritionData
        exclude = ("user",)
