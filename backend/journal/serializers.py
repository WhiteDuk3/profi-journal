from rest_framework import serializers
from .models import Article, Journal, Author, News

class JournalSerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = Journal
        fields = '__all__'

    def get_article_count(self, obj):
        return obj.articles.count()

class AuthorSerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = '__all__'

    def get_article_count(self, obj):
        return obj.articles.count()

class ArticleSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    pdf_file_url = serializers.SerializerMethodField()
    journal_name = serializers.CharField(source='journal.name', read_only=True)
    journal_id = serializers.IntegerField(source='journal.id', read_only=True)
    authors_detail = AuthorSerializer(source='authors', many=True, read_only=True)

    class Meta:
        model = Article
        fields = '__all__'

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None

    def get_pdf_file_url(self, obj):
        if obj.pdf_file:
            return obj.pdf_file.url
        return None

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'