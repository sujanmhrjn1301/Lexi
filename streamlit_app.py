import sys
try:
    __import__('pysqlite3')
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass # This allows it to still run on your Windows machine

import json
import os
import time
import warnings
from datetime import datetime

from dotenv import load_dotenv


import streamlit as st
from langchain_core._api.deprecation import LangChainDeprecationWarning
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains import RetrievalQA

try:
    from langchain_openai import ChatOpenAI
except ImportError:
    # Fallback for environments that still use the community integrations.
    from langchain_community.chat_models import ChatOpenAI

try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    # Fallback for environments that still use the community integrations.
    from langchain_community.embeddings import HuggingFaceEmbeddings

try:
    from langchain_chroma import Chroma
except ImportError:
    # Fallback for environments where Chroma lives in langchain_community.
    from langchain_community.vectorstores import Chroma


# Suppress Pydantic/LangChain warning noise from compatibility fallbacks.
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")
warnings.filterwarnings("ignore", category=LangChainDeprecationWarning)
# Load environment variables from .env
load_dotenv()

# --- 1. Page Configuration & API Setup ---
st.set_page_config(page_title="Nepal Law AI", page_icon="NL", layout="centered")

# Fetch API Key
try:
    OPENAI_API_KEY = st.secrets.get("OPENAI_API_KEY")
except:
    OPENAI_API_KEY = None

OPENAI_API_KEY = OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")

# CRITICAL FIX: Set the key as an environment variable so LangChain finds it automatically
if OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
else:
    st.error("Missing OPENAI_API_KEY. Please set it in .env or Streamlit Secrets.")
    st.stop()

DB_DIR = "./nepal_law_db"
REVIEW_JSON_PATH = "./processed_json/review_queue.json"
os.makedirs("./processed_json", exist_ok=True)

st.title("Lexi: The Legal Guide")
st.markdown("Accessible legal information for every citizen.")
st.sidebar.header("System Status")

# --- 2. Utility: Staging Queue Function ---
def save_to_review_queue(question, answer, source="Unknown"):
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

# --- 3. Load the RAG Engine (Cached) ---
@st.cache_resource
def initialize_engine():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )

    if not os.path.exists(DB_DIR):
        return None, None

    vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)

    # Initialize LLM - API key is NOT passed here. 
    # It is pulled automatically from os.environ["OPENAI_API_KEY"]
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.1
    )

    template = """
You are 'Nepal Law AI', a helpful legal assistant. Provide a direct, conversational answer.
Do NOT use headings like 'SUMMARY:', 'DETAILS:', or 'PUNISHMENT:'.

INSTRUCTIONS:
- Start with a direct answer to the user's question.
- Naturally mention the Act and Section/Article within your sentences.
- State any punishments or legal consequences clearly.
- CRITICAL: Keep your response concise (under 4 sentences Unless the user asks for detailed process). If the user asks for detailed process, you are allowed to give more sentences but make sure to end with a complete full stop. 
- CRITICAL: Do not start a detailed list if you cannot finish it. End with a complete full stop.
- CRITICAL: At the very end of your response, add a section titled "📜 LEGAL EVIDENCE:" 
- Under that title, list the 'law_title' found in the context metadata. If multiple laws are relevant, list them all separated by commas.

Context: {context}
Question: {question}

Helpful Answer:"""

    prompt = PromptTemplate(input_variables=["context", "question"], template=template)

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vector_db.as_retriever(search_kwargs={"k": 2}),
        chain_type_kwargs={"prompt": prompt},
    )

    return chain, llm

engine, raw_llm = initialize_engine()

if engine is None or raw_llm is None:
    st.error("Vector database (nepal_law_db) not found.")
    st.stop()
else:
    st.sidebar.success("Database and OpenAI connected")

# --- 4. Sidebar Stats ---
if os.path.exists(REVIEW_JSON_PATH):
    try:
        with open(REVIEW_JSON_PATH, "r", encoding="utf-8") as f:
            queue_count = len(json.load(f))
        st.sidebar.warning(f"Review queue: {queue_count} items")
    except (json.JSONDecodeError, OSError):
        pass

# --- 5. Chat History ---
if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# --- 6. Logic & Input ---
# ONLY RUN IF ENGINE IS READY
if engine is not None and raw_llm is not None:
    if user_query := st.chat_input("Ask about any law..."):
        # 1. Store and display user message
        st.session_state.messages.append({"role": "user", "content": user_query})
        with st.chat_message("user"):
            st.markdown(user_query)

        # 2. Assistant Response Logic
        with st.chat_message("assistant"):
            query_lower = user_query.lower().strip()
            law_triggers = ["law", "nepal", "punishment", "jail", "crime", "harass", "illegal", "rights", "constitution"]
            is_legal_query = any(word in query_lower for word in law_triggers)

            try:
                start_time = time.time()
                
                if not is_legal_query:
                    with st.spinner("Responding..."):
                        # Use invoke for modern LangChain compatibility
                        response = raw_llm.invoke(user_query)
                        answer = response.content
                else:
                    with st.spinner("Searching legal database..."):
                        # Ensure we are passing the correct dictionary to the chain
                        response = engine.invoke({"query": user_query})
                        answer = response["result"]
                        save_to_review_queue(user_query, answer, "Nepal Law Database")

                # 3. Render Answer
                st.markdown(answer)
                st.caption(Lexi can make mistakes. Consult a lawyer for official advice.")
                
                # 4. Save to session state
                st.session_state.messages.append({"role": "assistant", "content": answer})

                elapsed = round(time.time() - start_time, 2)
                st.sidebar.write(f"Response time: {elapsed}s")

            except Exception as e:
                st.error(f"Logic Error: {e}")
                st.info("This often happens if the Vector Database or API Key is not configured correctly.")

else:
    st.warning("⚠️ Lexi is currently offline. Please ensure the database and API keys are set up in the sidebar.")

# --- Footer ---
st.sidebar.markdown("---")
st.sidebar.info("Nepal Law AI: Lexi")