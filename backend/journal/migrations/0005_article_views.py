from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0004_news'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='views',
            field=models.IntegerField(default=0),
        ),
    ]
