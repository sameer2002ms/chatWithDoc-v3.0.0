import os
from langchain_openai import ChatOpenAI

def get_llm():
    model_name = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")

    return ChatOpenAI(
        model=model_name,
        temperature=0,
        timeout=30,
        max_retries=2,
    )
