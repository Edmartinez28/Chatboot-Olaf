from django.db import models

class CargaPDF(models.Model):
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
