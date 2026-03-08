from django.contrib import admin
from .models import Article, Journal, Author, News

class ArticleAdmin(admin.ModelAdmin):
    filter_horizontal = ('authors',)  # nice widget for many-to-many
    list_display = ('title', 'published_date', 'journal')
    # Optional: hide the old authors_text field if you no longer need it
    exclude = ('authors_text',)

admin.site.register(Article, ArticleAdmin)
admin.site.register(Journal)
admin.site.register(Author)
admin.site.register(News)