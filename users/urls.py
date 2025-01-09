from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('api/signup/', RegisterView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login')
]
