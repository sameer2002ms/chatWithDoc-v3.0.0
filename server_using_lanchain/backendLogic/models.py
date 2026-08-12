from django.db import models


class Document(models.Model):

    STATUS_CHOICES = [
        ("UPLOADING", "Uploading"),
        ("READY", "Ready"),
        ("FAILED", "Failed"),
    ]

    source_type = models.CharField(max_length=20)
    source_name = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/", null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UPLOADING",
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document {self.id} ({self.status})"
