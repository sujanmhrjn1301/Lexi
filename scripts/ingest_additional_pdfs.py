"""
Ingest additional PDFs into the existing vector database
"""
import os
import json
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

def extract_and_chunk_pdfs(data_folder="../data"):
    """Extract text from PDFs and chunk them"""
    
    pdf_files = [
        "criminal_code_nepal.pdf",
        "NP_Criminal Procedure Code_EN.pdf",
        "The-Labour-Act-2017.pdf"
    ]
    
    all_documents = []
    
    for pdf_file in pdf_files:
        pdf_path = os.path.join(data_folder, pdf_file)
        
        if not os.path.exists(pdf_path):
            print(f"⚠️  Skipping {pdf_file} - not found")
            continue
        
        print(f"📄 Processing {pdf_file}...")
        
        try:
            # Load PDF
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            
            # Chunk the documents
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            
            # Add metadata
            for chunk in chunks:
                chunk.metadata["law_title"] = pdf_file.replace(".pdf", "")
                chunk.metadata["source"] = pdf_file
            
            all_documents.extend(chunks)
            print(f"✅ {pdf_file}: {len(chunks)} chunks created")
            
        except Exception as e:
            print(f"❌ Error processing {pdf_file}: {e}")
    
    return all_documents

def add_to_vector_db(documents):
    """Add documents to the existing vector database"""
    
    if not documents:
        print("❌ No documents to add")
        return
    
    print(f"\n📚 Adding {len(documents)} chunks to vector database...")
    
    try:
        # Initialize embeddings with 768 dimensions (matching existing DB)
        embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            dimensions=768
        )
        
        # Load existing database
        persist_directory = "../nepal_law_db"
        vector_db = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )
        
        # Add documents in batches
        batch_size = 10
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i+batch_size]
            vector_db.add_documents(batch)
            print(f"  Progress: {min(i+batch_size, len(documents))}/{len(documents)} added")
        
        print(f"\n✅ SUCCESS! Added {len(documents)} documents to the database")
        
    except Exception as e:
        print(f"❌ Error adding to database: {e}")

if __name__ == "__main__":
    print("🔄 Extracting PDFs from data folder...\n")
    documents = extract_and_chunk_pdfs()
    
    if documents:
        print(f"\n📊 Total chunks created: {len(documents)}\n")
        add_to_vector_db(documents)
    else:
        print("❌ No documents extracted")
