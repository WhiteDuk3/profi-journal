from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Q, F
from .models import Article, Journal, Author, News
from .serializers import ArticleSerializer, JournalSerializer, AuthorSerializer, NewsSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-published_date')

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(abstract__icontains=search) |
                Q(content__icontains=search) |
                Q(authors_text__icontains=search)
            )

        # Filter by access type (open/closed) via journal
        access = self.request.query_params.get('access')
        if access in ('open', 'closed'):
            queryset = queryset.filter(journal__access_type=access)

        # Filter by journal
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            queryset = queryset.filter(journal_id=journal_id)

        # Filter by author
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(authors__id=author_id)

        # Ordering
        ordering = self.request.query_params.get('ordering')
        if ordering in ('-views', 'views', '-published_date', 'published_date'):
            queryset = queryset.order_by(ordering)

        # Limit
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass

        return queryset

    def retrieve(self, request, *args, **kwargs):
        # Increment view count on each detail fetch
        instance = self.get_object()
        Article.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


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

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )

        # Filter by access type
        access = self.request.query_params.get('access')
        if access in ('open', 'closed'):
            queryset = queryset.filter(access_type=access)

        # Ordering
        ordering = self.request.query_params.get('ordering')
        if ordering in ('-article_count', 'article_count', '-created_at', 'created_at'):
            if 'article_count' in ordering:
                from django.db.models import Count
                queryset = queryset.annotate(
                    ac=Count('articles')
                ).order_by('-ac' if ordering == '-article_count' else 'ac')
            else:
                queryset = queryset.order_by(ordering)

        # Limit
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass

        return queryset


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get_queryset(self):
        queryset = Author.objects.all().order_by('name')

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(affiliation__icontains=search) |
                Q(bio__icontains=search)
            )

        # Limit
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass

        return queryset


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
