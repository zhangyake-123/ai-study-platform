from pydantic import BaseModel
from fastapi import FastAPI
from dotenv import load_dotenv
from supabase import create_client, Client 
from fastapi.middleware.cors import CORSMiddleware 
from openai import OpenAI
import os 
import cohere

load_dotenv()

app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

cohere_api_key = os.getenv("COHERE_API_KEY")
cohere_rerank_model = os.getenv("COHERE_RERANK_MODEL")

dashscope_api_key = os.getenv("DASHSCOPE_API_KEY")
dashscope_base_url = os.getenv("DASHSCOPE_BASE_URL")
dashscope_embedding_model = os.getenv("DASHSCOPE_EMBEDDING_MODEL")
dashscope_chat_model = os.getenv("DASHSCOPE_CHAT_MODEL")

dashscope_client = OpenAI(api_key=dashscope_api_key, base_url=dashscope_base_url,) 
supabase: Client = create_client(supabase_url, supabase_key) 
cohere_client = cohere.ClientV2(api_key=cohere_api_key)

class SearchRequest(BaseModel):
    query: str
    course_slug: str
    match_count: int = 5 
    
def get_query_embedding(text: str):
    response = dashscope_client.embeddings.create(
        model=dashscope_embedding_model,
        input=text,
    )

    return response.data[0].embedding

@app.post("/search")
def search_chunks(request: SearchRequest):
    try:
        if not dashscope_embedding_model:
            return {
                "status": "error",
                "message": "DASHSCOPE_EMBEDDING_MODEL is not set."
                }

        query_vector = get_query_embedding(request.query)

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
        "dashscope_key_loaded": bool(dashscope_api_key),
        "dashscope_base_url_loaded": bool(dashscope_base_url),
        "dashscope_embedding_model_loaded": bool(dashscope_embedding_model),
        "dashscope_chat_model_loaded": bool(dashscope_chat_model),
        "supabase_url_loaded": bool(supabase_url),
        "supabase_key_loaded": bool(supabase_key),
        "cohere_key_loaded": bool(cohere_api_key),
        "rerank_model_loaded": bool(cohere_rerank_model),
    }

@app.get("/test-embedding")
def test_embedding():
    if not dashscope_embedding_model:
        return {
            "status": "error",
            "message": "DASHSCOPE_EMBEDDING_MODEL is not set."
        }

    text = "Gradient descent is an optimization algorithm used to minimize a function."
    vector = get_query_embedding(text)

    return {
        "status": "ok",
        "model": dashscope_embedding_model,
        "input_text": text,
        "vector_length": len(vector),
        "vector_preview": vector[:8],
    }

@app.post("/embed-pending-chunks")
def embed_pending_chunks():
    try:
        if not dashscope_embedding_model:
            return {
                "status": "error",
                "message": "DASHSCOPE_EMBEDDING_MODEL is not set."
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

            vector = get_query_embedding(content)

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
        if not dashscope_embedding_model:
            return {
                "status": "error",
                "message": "DASHSCOPE_EMBEDDING_MODEL is not set."
            }

        if not dashscope_chat_model:
            return {
                "status": "error",
                "message": "DASHSCOPE_CHAT_MODEL is not set."
            }

        if not cohere_rerank_model:
            return {
                "status": "error",
                "message": "COHERE_RERANK_MODEL is not set."
            }

        # 1. embedding
        query_vector = get_query_embedding(request.query)

        # 2. retrieval
        initial_match_count = max(request.match_count * 3, 8)

        rpc_result = supabase.rpc(
            "match_document_chunks",
            {
                "query_embedding": query_vector,
                "match_course_slug": request.course_slug,
                "match_count": initial_match_count,
            },
        ).execute()

        matches = rpc_result.data or []

        # 3. rerank
        reranked_matches = rerank_matches_with_cohere(request.query, matches)
        final_matches = reranked_matches[: request.match_count]

        if len(final_matches) == 0:
            return {
                "status": "ok",
                "query": request.query,
                "course_slug": request.course_slug,
                "matches": [],
                "retrieval_count": 0,
                "low_confidence": True,
                "answer": "I could not find relevant course materials for this question."
            }

        # 4. build context
        context_blocks = []
        for match in final_matches:
            context_blocks.append(
                f"[Chunk {match['chunk_index']} | similarity={match['similarity']:.4f} | rerank={match['rerank_score']:.4f}]\n{match['content']}"
            )

        context_text = "\n\n".join(context_blocks)

        prompt = f"""
                Instructions:
                - Answer the user's question using only the retrieved course material below.
                - If the material is insufficient, say so clearly.
                - Be concise but helpful.
                - Do not make up facts not supported by the provided material.

                User question:
                {request.query}

                Retrieved material:
                {context_text}
                """

        # 5. Qwen chat
        response = dashscope_client.chat.completions.create(
            model=dashscope_chat_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI tutor answering questions based only on the provided course materials."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        )

        answer_text = response.choices[0].message.content

        return {
            "status": "ok",
            "query": request.query,
            "course_slug": request.course_slug,
            "matches": final_matches,
            "retrieval_count": len(final_matches),
            "low_confidence": False,
            "answer": answer_text,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "type": type(e).__name__,
        }

def rerank_matches_with_cohere(query: str, matches: list[dict]) -> list[dict]:
    if not matches:
        return []

    documents = [match["content"] for match in matches]

    response = cohere_client.rerank(
        model=cohere_rerank_model,
        query=query,
        documents=documents,
        top_n=len(documents),
    )

    reranked = []
    for item in response.results:
        original_match = matches[item.index]
        updated_match = {
            **original_match,
            "rerank_score": item.relevance_score,
        }
        reranked.append(updated_match)

    return reranked 