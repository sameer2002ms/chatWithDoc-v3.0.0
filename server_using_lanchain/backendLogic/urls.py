from django.urls import path
from .views import (
    LangChainAskAPIView,
    LangChainUploadAPIView,
)

urlpatterns = [
    path("upload/", LangChainUploadAPIView.as_view()),
    path("ask/", LangChainAskAPIView.as_view()),
]
