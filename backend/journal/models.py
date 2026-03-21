from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Author(models.Model):
    name = models.CharField(max_length=200)
    affiliation = models.CharField(max_length=300, blank=True)
    bio = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    profile_image = models.ImageField(upload_to='authors/', blank=True, null=True)
    def __str__(self):
        return self.name

class Journal(models.Model):
    ACCESS_CHOICES = [
        ('open', 'Ochiq'),
        ('closed', 'Yopiq'),
    ]
    name = models.CharField(max_length=200)
    issn = models.CharField(max_length=9, blank=True, null=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='journal_covers/', blank=True, null=True)
    access_type = models.CharField(max_length=10, choices=ACCESS_CHOICES, default='open')
    created_at = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=200)
    abstract = models.TextField()
    content = models.TextField()
    authors_text = models.CharField(max_length=500, help_text="Comma-separated names")
    authors = models.ManyToManyField(Author, related_name='articles', blank=True)
    published_date = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=100, blank=True)
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='articles', null=True, blank=True)
    views = models.IntegerField(default=0)
    def __str__(self):
        return self.title

class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    views = models.IntegerField(default=0)
    def __str__(self):
        return self.title
