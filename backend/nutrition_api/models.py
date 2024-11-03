# backend/nutrition_api/models.py
from django.db import models
from django.contrib.auth.models import User


class UserNutritionData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    calories = models.IntegerField(default=0)
    total_fat = models.IntegerField(default=0)
    cholesterol = models.IntegerField(default=0)
    sodium = models.IntegerField(default=0)
    carbohydrates = models.IntegerField(default=0)
    protein = models.IntegerField(default=0)

    calories_limit = models.IntegerField(default=2000)
    total_fat_limit = models.IntegerField(default=78)
    cholesterol_limit = models.IntegerField(default=300)
    sodium_limit = models.IntegerField(default=2300)
    carbohydrates_limit = models.IntegerField(default=275)
    protein_limit = models.IntegerField(default=50)

    selected_goal = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        unique_together = ("user",)
