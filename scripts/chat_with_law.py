import json
import os
import time
import warnings
from datetime import datetime

from langchain_core._api.deprecation import LangChainDeprecationWarning

# Clean terminal from Pydantic/Python 3.14 warnings
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")
warnings.filterwarnings("ignore", category=LangChainDeprecationWarning)
warnings.simplefilter("ignore", LangChainDeprecationWarning)

try:
    from langchain_ollama import OllamaEmbeddings, ChatOllama
except ImportError:
    # Fallback for environments that still use the community integrations.
    from langchain_community.chat_models import ChatOllama
    from langchain_community.embeddings import OllamaEmbeddings

try:
    from langchain_chroma import Chroma
except ImportError:
    # Fallback for environments where Chroma lives in langchain_community.
    from langchain_community.vectorstores import Chroma

from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

# --- 1. CONFIGURATION & PATHS ---
DB_DIR = "../nepal_law_db"
REVIEW_JSON_PATH = "../processed_json/review_queue.json"

# Ensure directory for review queue exists
os.makedirs(os.path.dirname(REVIEW_JSON_PATH), exist_ok=True)

# --- 2. OPTIMIZED INITIALIZATION ---
print("[Boot] Nepal Law AI (Command Line Mode)...")

with warnings.catch_warnings():
    warnings.simplefilter("ignore", LangChainDeprecationWarning)
    embeddings = OllamaEmbeddings(model="nomic-embed-text")

if not os.path.exists(DB_DIR):
    print(f"[Error] {DB_DIR} not found. Run vectorize_data.py first!")
    raise SystemExit(1)

with warnings.catch_warnings():
    warnings.simplefilter("ignore", LangChainDeprecationWarning)
    vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)

with warnings.catch_warnings():
    warnings.simplefilter("ignore", LangChainDeprecationWarning)
    llm = ChatOllama(
        model="llama3",
        temperature=0.1,
        num_ctx=2048,
        num_predict=350,
        additional_kwargs={"keep_alive": -1},
    )


# --- 3. UTILITY FUNCTIONS ---
def save_to_review_queue(question, answer, source="Unknown"):
    """Saves AI response for manual review before final vectorization."""
    new_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "question": question,
        "content": answer,
        "metadata": {
            "law_title": source,
            "status": "pending_review",
            "type": "ai_generated_summary",
        },
    }

    existing_data = []
    if os.path.exists(REVIEW_JSON_PATH):
        with open(REVIEW_JSON_PATH, "r", encoding="utf-8") as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []

    existing_data.append(new_entry)

    with open(REVIEW_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=4, ensure_ascii=False)


# --- 4. THE NATURAL LANGUAGE PROMPT (V2) ---
template = """
You are 'Nepal Law AI', a helpful legal assistant. Provide a direct, conversational answer.
Do NOT use headings like 'SUMMARY:', 'DETAILS:', or 'PUNISHMENT:'.

INSTRUCTIONS:
- Start with a direct answer to the user's question.
- Naturally mention the Act and Section/Article within your sentences.
- State any punishments or legal consequences clearly.
- CRITICAL: Keep your response concise (under 4 sentences unless the user asks for detailed process). If the user asks for detailed process, you are allowed to give more sentences but make sure to end with a complete full stop.
- CRITICAL: Do not start a detailed list if you cannot finish it. End with a complete full stop.
- CRITICAL: At the very end of your response, add a section titled "LEGAL EVIDENCE:"
- Under that title, list the 'law_title' found in the context metadata.

Context: {context}
Question: {question}

Helpful Answer:"""

QA_CHAIN_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template=template,
)

qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=vector_db.as_retriever(search_kwargs={"k": 2}),
    chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
)


# --- 5. THE ROUTER & CLEANER ---
def get_answer(user_input):
    query = user_input.lower().strip()

    # Expanded triggers to match app.py and catch social/criminal issues
    law_triggers = [
        "article",
        "constitution",
        "rights",
        "law",
        "provision",
        "section",
        "nepal",
        "murder",
        "punishment",
        "jail",
        "crime",
        "labour",
        "harass",
        "abuse",
        "discrimination",
        "gay",
        "girl",
        "illegal",
        "threat",
    ]

    needs_rag = any(word in query for word in law_triggers)
    start_time = time.time()

    source_label = "General Chat"
    if not needs_rag:
        print("[Fast Track] Direct LLM response...")
        response = llm.invoke(
            f"The user says: {user_input}. Respond briefly and politely as the Nepal Law AI."
        )
        output = response.content
    else:
        print("[RAG Track] Searching legal database...")
        response = qa_chain.invoke(user_input)
        output = response["result"]
        source_label = "Nepal Law Database"

    # --- POST-PROCESSING: THE "GUILLOTINE" FIX ---
    output = output.strip()

    if not output.endswith((".", "!", "?")):
        last_punctuation = max(output.rfind("."), output.rfind("!"), output.rfind("?"))
        if last_punctuation != -1:
            output = output[: last_punctuation + 1]
            output += " [Summary shortened for brevity.]"
        else:
            output += "... [Response truncated. Please be more specific.]"

    # --- SAVE TO STAGING ---
    if needs_rag:
        save_to_review_queue(user_input, output, source_label)

    end_time = time.time()
    print(f"[Timing] Response time: {round(end_time - start_time, 2)} seconds")
    return output


# --- 6. LOOP ---
print("\nNepal Law AI is ready. Type 'exit' to stop.")

while True:
    u_in = input("\nUser: ")
    if u_in.lower() in ["exit", "quit"]:
        break
    if not u_in.strip():
        continue

    try:
        print(f"\nAI: {get_answer(u_in)}")
    except Exception as e:
        print(f"\n[Error] {e}")
