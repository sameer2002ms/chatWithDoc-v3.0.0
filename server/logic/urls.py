from django.urls import path
from .views import (
    LangChainAskAPIView,
    LangChainUploadAPIView,
    RateLimitTestAPIView
)

urlpatterns = [
    path("upload/", LangChainUploadAPIView.as_view()),
    path("ask/", LangChainAskAPIView.as_view()),
    path("test/", RateLimitTestAPIView.as_view())
]
