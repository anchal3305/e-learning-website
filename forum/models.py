from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Thread(models.Model):
    category = models.ForeignKey(Category, related_name='threads', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='threads', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Post(models.Model):
    thread = models.ForeignKey(Thread, related_name='posts', on_delete=models.CASCADE)
    message = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='posts', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:20]