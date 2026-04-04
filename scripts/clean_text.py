# import os
# import re
# import warnings
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_ollama import OllamaEmbeddings
# from langchain_chroma import Chroma

# # Suppress Pydantic warnings
# warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

# # --- 1. CONFIGURATION ---
# new_files = [
#     {"path": "./data/The-Labour-Act-2017.pdf", "source": "Labor Act 2017"},
#     {"path": "./data/NP_Criminal Procedure Code_EN.pdf", "source": "Criminal Procedure Code"}
# ]
# DB_DIR = "./nepal_law_db"

# # --- 2. TEXT CLEANING FUNCTION ---
# def clean_text(text):
#     """Removes PDF noise, extra spaces, and weird characters."""
#     # Remove page numbers and headers (generic pattern)
#     text = re.sub(r'Page \d+ of \d+', '', text)
#     # Remove multiple newlines and extra spaces
#     text = re.sub(r'\s+', ' ', text)
#     # Remove non-ascii characters often found in PDF bullets
#     text = re.sub(r'[^\x00-\x7F]+', ' ', text)
#     return text.strip()

# # --- 3. THE ADVANCED VECTORIZATION ENGINE ---
# def process_and_append():
#     embeddings = OllamaEmbeddings(model="nomic-embed-text")
    
#     # Initialize or Load Database
#     if os.path.exists(DB_DIR):
#         print(f"📂 Loading existing database at {DB_DIR}...")
#         vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
#     else:
#         print(f"🆕 Creating new database at {DB_DIR}...")
#         vector_db = None

#     for file_info in new_files:
#         path = file_info["path"]
#         source_name = file_info["source"]

#         if not os.path.exists(path):
#             print(f"⚠️ File not found: {path}")
#             continue

#         print(f"📖 Processing: {source_name}")
#         loader = PyPDFLoader(path)
#         raw_docs = loader.load()

#         # STEP 1: CLEANING
#         for doc in raw_docs:
#             doc.page_content = clean_text(doc.page_content)
#             doc.metadata["law_title"] = source_name

#         # STEP 2: STRUCTURAL CHUNKING
#         # We use specific separators to prioritize breaking at Sections or Articles
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=150,
#             separators=["\nSection ", "\nArticle ", "\nChapter ", "\n", ". ", " ", ""]
#         )
#         chunks = text_splitter.split_documents(raw_docs)

#         # STEP 3: VECTORIZATION
#         print(f"🚀 Vectorizing {len(chunks)} cleaned chunks...")
#         if vector_db is None:
#             vector_db = Chroma.from_documents(
#                 documents=chunks, 
#                 embedding=embeddings, 
#                 persist_directory=DB_DIR
#             )
#         else:
#             vector_db.add_documents(chunks)
        
#         print(f"✅ Finished {source_name}")

# if __name__ == "__main__":
#     process_and_append()
#     print("\n🎉 Database updated with clean, structured legal data!")


import os
import re
import json
import hashlib
import warnings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

# Suppress Pydantic warnings
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

# --- 1. CONFIGURATION ---
DATA_SOURCES = [
    {"path": "./data/....", "source": "Labor Act 2017"},
    # {"path": "./data/......", "source": "Criminal Procedure Code"}
]
DB_DIR = "./nepal_law_db"
MASTER_JSON_PATH = "./processed_json/master_laws_data.json"

# Ensure the folder exists
os.makedirs(os.path.dirname(MASTER_JSON_PATH), exist_ok=True)

# --- 2. UTILITY FUNCTIONS ---

def clean_text(text):
    text = re.sub(r'Page \d+ of \d+', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    return text.strip()

def generate_chunk_id(content, metadata):
    hash_input = f"{content}{metadata.get('law_title', '')}"
    return hashlib.md5(hash_input.encode()).hexdigest()

def append_to_master_json(new_chunks):
    """Loads existing JSON data and appends new chunks without duplicates."""
    existing_data = []
    
    # 1. Load existing data if file exists
    if os.path.exists(MASTER_JSON_PATH):
        with open(MASTER_JSON_PATH, 'r', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []

    # 2. Convert new chunks to dictionary format
    new_data_list = [
        {"content": chunk.page_content, "metadata": chunk.metadata} 
        for chunk in new_chunks
    ]

    # 3. Combine and save (Simple append)
    combined_data = existing_data + new_data_list
    
    with open(MASTER_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=4)
    print(f"📄 Master JSON updated. Total chunks in JSON: {len(combined_data)}")

# --- 3. MAIN PROCESSING ENGINE ---

def process_and_vectorize():
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    
    if os.path.exists(DB_DIR):
        print(f"📂 Loading existing database from {DB_DIR}...")
        vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
        existing_ids = set(vector_db.get()["ids"])
    else:
        print(f"🆕 Creating new database...")
        vector_db = None
        existing_ids = set()

    for file_info in DATA_SOURCES:
        path = file_info["path"]
        source_name = file_info["source"]

        if not os.path.exists(path):
            print(f"⚠️ File missing: {path}")
            continue

        print(f"\n📖 Processing: {source_name}")
        loader = PyPDFLoader(path)
        raw_docs = loader.load()

        for doc in raw_docs:
            doc.page_content = clean_text(doc.page_content)
            doc.metadata["law_title"] = source_name

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, 
            chunk_overlap=150,
            separators=["\nSection ", "\nArticle ", "\nChapter ", "\n", ". ", " ", ""]
        )
        all_chunks = text_splitter.split_documents(raw_docs)
        
        # --- LOGIC: Only Append NEW Data to JSON and DB ---
        new_chunks_for_db = []
        new_ids = []
        
        for chunk in all_chunks:
            chunk_id = generate_chunk_id(chunk.page_content, chunk.metadata)
            if chunk_id not in existing_ids:
                new_chunks_for_db.append(chunk)
                new_ids.append(chunk_id)
                existing_ids.add(chunk_id)

        if new_chunks_for_db:
            # 1. Update Master JSON
            append_to_master_json(new_chunks_for_db)
            
            # 2. Update Chroma DB
            print(f"🚀 Vectorizing {len(new_chunks_for_db)} NEW chunks...")
            if vector_db is None:
                vector_db = Chroma.from_documents(
                    documents=new_chunks_for_db, ids=new_ids,
                    embedding=embeddings, persist_directory=DB_DIR
                )
            else:
                vector_db.add_documents(documents=new_chunks_for_db, ids=new_ids)
            print(f"✅ {source_name} added.")
        else:
            print(f"ℹ️ {source_name} is already in the system. No changes made.")

if __name__ == "__main__":
    process_and_vectorize()
    print("\n🎉 Master Database and Master JSON are perfectly synced!")