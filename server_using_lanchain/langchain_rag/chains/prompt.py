from langchain_core.prompts import PromptTemplate

RAG_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are a factual assistant answering questions strictly from the provided context.

Rules:
- Use ONLY the given context.
- If the answer is not present, say: "I don't know based on the provided document."
- Be concise and accurate.
- Do not hallucinate.

Context:
{context}

Question:
{question}

Answer:
""".strip()
)
