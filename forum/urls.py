from django.urls import path
from .views import CategoryListCreateView, ThreadListCreateView, PostListCreateView

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('threads/', ThreadListCreateView.as_view(), name='thread-list-create'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
]