from rest_framework import serializers

class LangChainAskSerializer(serializers.Serializer):
    question = serializers.CharField()
    top_k = serializers.IntegerField(default=5, min_value=1, max_value=20)

    
from rest_framework import serializers

class UploadDocumentSerializer(serializers.Serializer):
    source_type = serializers.ChoiceField(
        choices=("pdf", "word", "html", "url")
    )
    file = serializers.FileField(required=False, allow_null=True)
    url = serializers.URLField(required=False, allow_null=True)

    def validate(self, data):
        source_type = data.get("source_type")

        if source_type == "url":
            if not data.get("url"):
                raise serializers.ValidationError(
                    {"url": "URL is required when source_type is 'url'"}
                )
        else:
            if not data.get("file"):
                raise serializers.ValidationError(
                    {"file": "File is required when source_type is not 'url'"}
                )

        return data
