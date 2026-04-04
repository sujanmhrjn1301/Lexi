# Data Organization Guide

## Folder Structure

```
data/
├── raw/                    # Original, unprocessed data
│   └── [place raw law files here]
│
├── processed/              # Cleaned and structured data
│   └── [processed files after cleaning]
│
└── vectors/                # Vector embeddings
    └── [ChromaDB index will go here if configured]
```

## RAW Data (`/raw`)

**Purpose**: Store original law documents as received

**Examples**:
- `Nepal_Criminal_Code.txt`
- `Property_Law.pdf`
- `Civil_Code_Original.docx`

**Note**: Data in this folder should be cleaned before use

---

## Processed Data (`/processed`)

**Purpose**: Cleaned, normalized, and chunked data

**Examples**:
- `Nepal_Criminal_Code_cleaned.txt` - After `clean_text.py`
- `laws_structured.json` - After `Structural_Chunking.py`

**Note**: This is the data ready for vectorization

---

## Vectors (`/vectors`)

**Purpose**: ChromaDB vector database index

**When Generated**:
After running `vectorize_data.py`, the ChromaDB index will be created here

**Current Location**: Currently stored in root `nepal_law_db/` (can be moved here)

---

## Data Processing Workflow

```
1. Place raw files in /raw
   ↓
2. Run: python ../scripts/clean_text.py
   → Creates files in /processed
   ↓
3. Run: python ../scripts/Structural_Chunking.py
   → Creates JSON chunks in /processed
   ↓
4. Run: python ../scripts/vectorize_data.py
   → Creates vector index in /vectors or root
   ↓
5. Backend uses vectors for semantic search
```

---

## Working with Data

### Add New Law Data

1. Place raw files in `data/raw/`
2. Run cleaning script:
   ```bash
   cd scripts
   python clean_text.py ../data/raw/new_law.txt ../data/processed/new_law_cleaned.txt
   ```
3. Run chunking script:
   ```bash
   python Structural_Chunking.py
   ```
4. Vectorize:
   ```bash
   python vectorize_data.py
   ```

### Update Vector Database

```bash
cd scripts
python vectorize_data.py --update
```

### Backup Data

```bash
# Backup vector database
cp -r data/vectors data/vectors.backup

# Backup processed data
cp -r data/processed data/processed.backup
```

---

## File Organization Tips

- ✅ Keep raw data separated from processed
- ✅ Use descriptive filenames
- ✅ Document the source of data
- ✅ Version your processed files: `laws_v1.json`, `laws_v2.json`
- ✅ Regularly backup vectors folder

---

## Storage Recommendations

| Location | What | Size |
|----------|------|------|
| `/raw` | Original documents | Depends |
| `/processed` | Text + JSON | Smaller |
| `/vectors` | ChromaDB index | ~100MB+ |

**Note**: For production, consider cloud storage (S3, GCS)

---

## Data Cleanup

Remove old data:
```bash
# Remove old processed files
rm data/processed/old_version.json

# Remove old vector index (will be recreated)
rm -rf data/vectors/
```

Then regenerate vectors:
```bash
cd scripts
python vectorize_data.py
```

---

## Integration with Backend

The FastAPI backend automatically looks for ChromaDB in:
1. `VECTOR_DB_PATH` environment variable (default: `./nepal_law_db`)
2. Falls back to `./data/vectors`

To change location:
```env
# .env
VECTOR_DB_PATH=./data/vectors
```

Then restart backend.
