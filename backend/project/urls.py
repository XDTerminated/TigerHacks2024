# project urls.py
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.contrib import admin


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("nutrition_api.urls")),
    path("token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("", include("jwt_authentication.urls")),
]
