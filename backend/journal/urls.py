from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, JournalViewSet, AuthorViewSet, stats, NewsViewSet

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'journals', JournalViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'news', NewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', stats, name='stats'),
]