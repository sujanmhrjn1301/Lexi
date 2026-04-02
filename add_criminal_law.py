import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

# 1. Setup Paths
# Replace this with the actual name of your Criminal Law PDF
PDF_PATH = "./data/criminal_code_nepal.pdf" 
DB_DIR = "./nepal_law_db"

if not os.path.exists(PDF_PATH):
    print(f"❌ Error: Could not find {PDF_PATH}")
    exit()

print(f"📖 Loading {PDF_PATH}...")

# 2. Load and Split the PDF
loader = PyPDFLoader(PDF_PATH)
docs = loader.load()

# We use a slightly smaller chunk size for Criminal Law to keep Articles distinct
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    separators=["\n\n", "\n", " ", ""]
)
chunks = text_splitter.split_documents(docs)

print(f"✅ Split into {len(chunks)} chunks.")

# 3. Initialize Embeddings (Must be the SAME as your Constitution)
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# 4. APPEND to the existing Database
print(f"🚀 Adding Criminal Law to {DB_DIR}...")

vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=DB_DIR  # This ensures it goes into the same folder
)

print("🎉 Success! Your database now contains both the Constitution and Criminal Law.")