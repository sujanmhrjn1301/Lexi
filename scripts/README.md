# Lexi Data Processing Scripts

This directory contains legacy data processing scripts used to prepare Nepal law data for the vector database.

## Scripts Overview

### `clean_text.py`
Cleans and normalizes raw law text:
- Removes extra whitespace
- Sanitizes special characters
- Normalizes formatting

**Usage:**
```bash
python clean_text.py <input_file> <output_file>
```

### `Structural_Chunking.py`
Breaks laws into logical chunks for better vector storage:
- Identifies law sections
- Creates meaningful chunks
- Preserves context

**Usage:**
```bash
python Structural_Chunking.py
```

### `vectorize_data.py`
Converts cleaned law text to embeddings and stores in ChromaDB:
- Creates HuggingFace embeddings
- Stores in ChromaDB vector database
- Maintains metadata

**Usage:**
```bash
python vectorize_data.py
```

### `add_criminal_law.py`
Adds criminal law specific data to the database

**Usage:**
```bash
python add_criminal_law.py
```

### `chat_with_law.py`
Legacy chat interface before the full-stack redesign

---

## Data Processing Pipeline

```
Raw Law Data
    ↓
[clean_text.py] → Cleaned Text
    ↓
[Structural_Chunking.py] → Chunked Documents
    ↓
[vectorize_data.py] → Vector Embeddings (ChromaDB)
    ↓
Production Database (nepal_law_db/)
```

## Running the Full Pipeline

```bash
# 1. Clean raw text
python clean_text.py ../data/raw/laws.txt ../data/processed/laws_cleaned.txt

# 2. Chunk the text
python Structural_Chunking.py

# 3. Vectorize and store
python vectorize_data.py

# 4. Add criminal law data
python add_criminal_law.py
```

## Output

- **Cleaned texts**: `../data/processed/`
- **Structured chunks**: `final_structured_chunks.json`
- **Vector database**: `../data/vectors/` (or root if configured)

**Note:** These scripts are legacy. The modern approach uses the FastAPI backend with async processing.
