from django.shortcuts import render
from rest_framework import viewsets

from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.decorators import action
from django.db.models import Q
from .models import Article, Journal, Author, News 
from .serializers import ArticleSerializer, JournalSerializer, AuthorSerializer, NewsSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-published_date')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(abstract__icontains=search) |
                Q(content__icontains=search) |
                Q(authors_text__icontains=search)
            )
        return queryset

@api_view(['GET'])
def stats(request):
    return Response({
        'journals': Journal.objects.count(),
        'authors': Author.objects.count(),
        'articles': Article.objects.count(),
    })


class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all() 
    serializer_class = JournalSerializer

    def get_queryset(self):
        queryset = Journal.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        return queryset

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    
    def get_queryset(self):
        queryset = Author.objects.all().order_by('name')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(affiliation__icontains=search) |
                Q(bio__icontains=search)
            )
        return queryset

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer