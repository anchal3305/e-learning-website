from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_notes, name='get_notes'),
    path('create/', views.create_note, name='create_note'),
    path('update/<int:pk>/', views.update_note, name='update_note'),
    path('delete/<int:pk>/', views.delete_note, name='delete_note'),
    path('<int:pk>/', views.note_detail, name='note_detail'),
]
