from rest_framework import serializers

class LangChainAskSerializer(serializers.Serializer):
    question = serializers.CharField()
    top_k = serializers.IntegerField(default=5, min_value=1, max_value=20)


class UploadDocumentSerializer(serializers.Serializer):
    source_type = serializers.ChoiceField(choices=("pdf",), default="pdf", required=False)
    file = serializers.FileField(required=True)

    def validate(self, data):
        if not data.get("file"):
            raise serializers.ValidationError({"file": "File is required."})

        return data
