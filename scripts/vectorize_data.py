import json
import os
from langchain_core.documents import Document 
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

def build_vector_db(json_path):
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    # 1. Load the JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 2. Convert to Documents with text trimming
    documents = []
    for item in data:
        text = item["text"]
        # If any chunk is too long, we truncate it slightly
        if len(text) > 7000:
            text = text[:7000]
            
        doc = Document(page_content=text, metadata=item["metadata"])
        documents.append(doc)

    print(f"Loaded {len(documents)} articles. Initializing embeddings...")

    # 3. Initialize Embeddings with 768-dimensional model
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )

    # 4. Create the Database in Batches
    # This is the safest way to avoid 'Context Length' errors
    persist_directory = "../nepal_law_db"
    
    print("Vectorizing data in batches... Please wait.")
    
    # We initialize the DB with the first 10 documents, then add the rest
    batch_size = 10
    vector_db = Chroma.from_documents(
        documents=documents[:batch_size],
        embedding=embeddings,
        persist_directory=persist_directory
    )

    # Add the remaining documents in loops
    for i in range(batch_size, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        vector_db.add_documents(batch)
        print(f"Progress: {i + len(batch)}/{len(documents)} articles indexed...", end="\r")

    print(f"\n✅ SUCCESS! Your local brain is ready at {persist_directory}")

if __name__ == "__main__":
    build_vector_db("../final_structured_chunks.json")