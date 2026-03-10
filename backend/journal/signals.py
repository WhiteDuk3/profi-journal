import requests
import os
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Article, Journal, Author, News

def revalidate_cache():
    secret = os.environ.get('REVALIDATE_SECRET')
    url = os.environ.get('VERCEL_URL')
    if not secret or not url:
        return
    try:
        requests.post(
            f'{url}/api/revalidate?secret={secret}',
            timeout=5
        )
    except Exception:
        pass

@receiver([post_save, post_delete], sender=Article)
@receiver([post_save, post_delete], sender=Journal)
@receiver([post_save, post_delete], sender=Author)
@receiver([post_save, post_delete], sender=News)
def trigger_revalidation(sender, **kwargs):
    revalidate_cache()
