from pydantic import BaseModel
from fastapi import FastAPI
from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client 
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_api_key = os.getenv("GEMINI_API_KEY")
embedding_model = os.getenv("GEMINI_EMBEDDING_MODEL")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY") 
chat_model = os.getenv("GEMINI_CHAT_MODEL")

genai_client = genai.Client(api_key=gemini_api_key)
supabase: Client = create_client(supabase_url, supabase_key) 

class SearchRequest(BaseModel):
    query: str
    course_slug: str
    match_count: int = 5 

@app.post("/search")
def search_chunks(request: SearchRequest):
    try:
        if not embedding_model:
            return {
                "status": "error",
                "message": "GEMINI_EMBEDDING_MODEL is not set."
            }

        embedding_response = genai_client.models.embed_content(
            model=embedding_model,
            contents=request.query,
        )

        query_vector = embedding_response.embeddings[0].values

        rpc_result = supabase.rpc(
            "match_document_chunks",
            {
                "query_embedding": query_vector,
                "match_course_slug": request.course_slug,
                "match_count": request.match_count,
            },
        ).execute()

        return {
            "status": "ok",
            "query": request.query,
            "course_slug": request.course_slug,
            "matches": rpc_result.data,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "type": type(e).__name__, 
        }

@app.get("/")
def read_root():
    return {
        "message": "Python AI service is running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "gemini_key_loaded": bool(gemini_api_key),
        "embedding_model_loaded": bool(embedding_model), 
        "chat_model_loaded": bool(chat_model),
        "supabase_url_loaded": bool(supabase_url),
        "supabase_key_loaded": bool(supabase_key),
    }

@app.get("/test-embedding")
def test_embedding():
    if not embedding_model:
        return {
            "status": "error",
            "message": "GEMINI_EMBEDDING_MODEL is not set."
        }

    text = "Gradient descent is an optimization algorithm used to minimize a function."

    response = genai_client.models.embed_content(
        model=embedding_model,
        contents=text,
    )

    vector = response.embeddings[0].values

    return {
        "status": "ok",
        "model": embedding_model,
        "input_text": text,
        "vector_length": len(vector),
        "vector_preview": vector[:8],
    }

@app.post("/embed-pending-chunks")
def embed_pending_chunks():
    try:
        if not embedding_model:
            return {
                "status": "error",
                "message": "GEMINI_EMBEDDING_MODEL is not set."
            }

        result = (
            supabase.table("document_chunks")
            .select("id, content")
            .is_("embedding", "null")
            .limit(20)
            .execute()
        )

        chunks = result.data

        if not chunks:
            return {
                "status": "ok",
                "message": "No pending chunks found.",
                "processed_count": 0,
            }

        processed_count = 0

        for chunk in chunks:
            chunk_id = chunk["id"]
            content = chunk["content"]

            embedding_response = genai_client.models.embed_content(
                model=embedding_model,
                contents=content,
            )

            vector = embedding_response.embeddings[0].values

            (
                supabase.table("document_chunks")
                .update({"embedding": vector})
                .eq("id", chunk_id)
                .execute()
            )

            processed_count += 1

        return {
            "status": "ok",
            "message": "Finished embedding pending chunks.",
            "processed_count": processed_count,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "type": type(e).__name__,
        } 

@app.post("/ask")
def ask_question(request: SearchRequest):
    try:
        if not embedding_model:
            return {
                "status": "error",
                "message": "GEMINI_EMBEDDING_MODEL is not set."
            }

        if not chat_model:
            return {
                "status": "error",
                "message": "GEMINI_CHAT_MODEL is not set."
            }

        embedding_response = genai_client.models.embed_content(
            model=embedding_model,
            contents=request.query,
        )
        query_vector = embedding_response.embeddings[0].values

        rpc_result = supabase.rpc(
            "match_document_chunks",
            {
                "query_embedding": query_vector,
                "match_course_slug": request.course_slug,
                "match_count": request.match_count,
            },
        ).execute()

        matches = rpc_result.data or []

        if len(matches) == 0:
            return {
                "status": "ok",
                "query": request.query,
                "course_slug": request.course_slug,
                "matches": [],
                "retrieval_count": 0,
                "low_confidence": True,
                "answer": "I could not find relevant course materials for this question."
            }

        top_similarity = matches[0]["similarity"] if matches else 0
        low_confidence = top_similarity < 0.65

        context_blocks = []
        for match in matches:
            context_blocks.append(
                f"[Chunk {match['chunk_index']} | similarity={match['similarity']:.4f}]\n{match['content']}"
            )

        context_text = "\n\n".join(context_blocks)

        prompt = f"""
You are an AI tutor answering questions based only on the provided course materials.

Instructions:
- Answer the user's question using only the retrieved course material below.
- If the material is insufficient, say so clearly.
- Be concise but helpful.
- Do not make up facts not supported by the provided material.

User question:
{request.query}

Retrieved course material:
{context_text}
"""

        response = genai_client.models.generate_content(
            model=chat_model,
            contents=prompt,
        )

        answer_text = response.text if hasattr(response, "text") else str(response)

        return {
            "status": "ok",
            "query": request.query,
            "course_slug": request.course_slug,
            "matches": matches,
            "retrieval_count": len(matches),
            "low_confidence": low_confidence,
            "answer": answer_text,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "type": type(e).__name__,
        }