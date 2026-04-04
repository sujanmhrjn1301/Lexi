# 📋 Python File Management Guide

## Root-Level Python Files to Organize

Your Lexi project has these Python files at the root that need organization:

```
Currently at root:
❌ add_criminal_law.py
❌ chat_with_law.py
❌ clean_text.py
❌ cleaned_texts.py
❌ streamlit_app.py (old)
❌ Structural_Chunking.py
❌ vectorize_data.py

Should be in: scripts/
```

---

## 📁 Recommended Organization

### Option 1: Simple (Recommended)
Move all legacy scripts to `scripts/`:
```
scripts/
├── README.md                    # Documentation
├── add_criminal_law.py          # Add criminal law data
├── chat_with_law.py             # Legacy chat interface
├── clean_text.py                # Clean text utility
├── cleaned_texts.py             # Clean text variant
├── Structural_Chunking.py       # Break into chunks
├── vectorize_data.py            # Create embeddings
└── streamlit_app.py             # Old Streamlit app
```

### Option 2: Categorized (Advanced)
Organize by purpose:
```
scripts/
├── README.md
├── data_processing/             # Data workflows
│   ├── clean_text.py
│   ├── cleaned_texts.py
│   ├── Structural_Chunking.py
│   └── vectorize_data.py
├── data_management/             # Data managment
│   └── add_criminal_law.py
└── legacy_ui/                   # Old interfaces
    ├── chat_with_law.py
    └── streamlit_app.py
```

---

## 🔄 File-by-File Guide

### 1. `add_criminal_law.py`
**Purpose:** Loads criminal law PDF and adds to vector database  
**Usage:** 
```bash
cd scripts
python add_criminal_law.py
```
**Depends on:** ChromaDB, LangChain  
**Output:** Updates nepal_law_db/  
**Status:** ✅ Legacy but functional

---

### 2. `chat_with_law.py`
**Purpose:** Old chat interface before FastAPI backend  
**Usage:** 
```bash
cd scripts
python chat_with_law.py
```
**Depends on:** LangChain, ChromaDB, Ollama  
**Status:** ⚠️ Legacy - Use FastAPI backend instead  
**Alternative:** Use React frontend + FastAPI backend

---

### 3. `clean_text.py`
**Purpose:** Cleans text from PDFs  
**Usage:**
```bash
cd scripts
python clean_text.py <input_file> <output_file>
```
**Depends on:** PyMuPDF (fitz)  
**Output:** Cleaned .txt file  
**Status:** ✅ Useful for preprocessing

---

### 4. `cleaned_texts.py`
**Purpose:** Alternative text cleaning with PyMuPDF  
**Usage:**
```bash
cd scripts
python cleaned_texts.py
```
**Depends on:** PyMuPDF (fitz)  
**Output:** cleaned_constitution.txt  
**Status:** ⚠️ Older version - prefer clean_text.py  
**Note:** Can be deprecated if clean_text.py works

---

### 5. `Structural_Chunking.py`
**Purpose:** Splits laws into logical chunks  
**Usage:**
```bash
cd scripts
python Structural_Chunking.py
```
**Input:** cleaned_constitution.txt  
**Output:** final_structured_chunks.json  
**Status:** ✅ Part of data pipeline  
**Important:** Run after clean_text.py

---

### 6. `vectorize_data.py`
**Purpose:** Creates embeddings and stores in ChromaDB  
**Usage:**
```bash
cd scripts
python vectorize_data.py
```
**Input:** final_structured_chunks.json  
**Output:** ChromaDB index (nepal_law_db/)  
**Status:** ✅ Part of data pipeline  
**Important:** Final step in pipeline

---

### 7. `streamlit_app.py` (old)
**Purpose:** Old Streamlit interface  
**Status:** ❌ **DEPRECATED**  
**Why:** Replaced by:
- ✅ React Frontend (modern UI)
- ✅ FastAPI Backend (better API)
- ✅ Full-stack application

**If you need to keep:** Move to scripts/legacy_ui/

---

## 🚀 Migration Steps

### Step 1: Backup Root Files
```bash
# Create backup folder
mkdir scripts/backup

# Copy current files
cp add_criminal_law.py scripts/
cp chat_with_law.py scripts/
cp clean_text.py scripts/
cp cleaned_texts.py scripts/
cp Structural_Chunking.py scripts/
cp vectorize_data.py scripts/
cp streamlit_app.py scripts/
```

### Step 2: Verify Scripts Run
```bash
cd scripts

# Test each script
python clean_text.py --help
python Structural_Chunking.py --help
python vectorize_data.py --help
```

### Step 3: Update Paths (if needed)
Some scripts may have hardcoded paths. Update them:

**Before:**
```python
PDF_PATH = "./data/criminal_code_nepal.pdf"
```

**After:**
```python
PDF_PATH = "../data/criminal_code_nepal.pdf"  # One level up
```

### Step 4: Clean Up Root
```bash
# After moving to scripts/, remove originals from root
rm add_criminal_law.py
rm chat_with_law.py
rm clean_text.py
rm cleaned_texts.py
rm Structural_Chunking.py
rm vectorize_data.py
# Keep or archive streamlit_app.py
mv streamlit_app.py scripts/legacy_ui/  # or delete
```

### Step 5: Update Documentation
- ✅ Already done! See scripts/README.md

---

## 📊 File Status & Recommendations

| File | Type | Status | Keep? | Note |
|------|------|--------|-------|------|
| add_criminal_law.py | Script | ✅ Active | Yes | Use for adding laws |
| chat_with_law.py | Script | ⚠️ Legacy | No | Use FastAPI backend |
| clean_text.py | Script | ✅ Active | Yes | Text preprocessing |
| cleaned_texts.py | Script | ⚠️ Old | Maybe | Backup only |
| Structural_Chunking.py | Script | ✅ Active | Yes | Part of pipeline |
| vectorize_data.py | Script | ✅ Active | Yes | Creates embeddings |
| streamlit_app.py | App | ❌ Deprecated | No | Use React/FastAPI |

---

## 🔄 Data Processing Pipeline (with moved files)

```
scripts/clean_text.py
    ↓ (input: raw PDF)
    ↓ (output: cleaned .txt)
    
scripts/Structural_Chunking.py
    ↓ (input: cleaned .txt)
    ↓ (output: structured JSON)
    
scripts/vectorize_data.py
    ↓ (input: JSON chunks)
    ↓ (output: ChromaDB vectors)
    
Backend uses vectors for semantic search
```

---

## 💾 Path Updates Needed

### Files That Need Path Updates

#### `add_criminal_law.py` (if using relative paths)
```python
# Current:
PDF_PATH = "./data/criminal_code_nepal.pdf"
DB_DIR = "./nepal_law_db"

# Should be:
PDF_PATH = "../data/criminal_code_nepal.pdf"
DB_DIR = "../nepal_law_db"

# Or use absolute paths from environment
```

#### `Structural_Chunking.py` (if using relative paths)
```python
# Update input/output paths to use ../data/
```

#### `vectorize_data.py` (if using relative paths)
```python
# Update paths accordingly
```

---

## 🗂️ Complete File Tree After Migration

```
Lexi/
├── backend/                    (modern API)
├── frontend/                   (modern UI)
├── scripts/                    (organized legacy!)
│   ├── README.md
│   ├── add_criminal_law.py
│   ├── chat_with_law.py
│   ├── clean_text.py
│   ├── cleaned_texts.py
│   ├── Structural_Chunking.py
│   ├── vectorize_data.py
│   └── streamlit_app.py
├── data/
│   ├── raw/
│   ├── processed/
│   └── vectors/
└── docs/
    ├── README.md
    ├── ARCHITECTURE.md
    └── API.md
```

---

## 🎯 Using Organized Scripts

### Add New Law Data
```bash
cd scripts
python add_criminal_law.py
```

### Clean Raw Text
```bash
cd scripts
python clean_text.py ../data/raw/new_law.pdf ../data/processed/new_law_cleaned.txt
```

### Process (Full Pipeline)
```bash
cd scripts

# 1. Clean
python clean_text.py input.pdf cleaned.txt

# 2. Chunk
python Structural_Chunking.py

# 3. Vectorize
python vectorize_data.py

# Done! Backend now has new data
```

---

## ⚠️ Important Notes

### Path Variables
All scripts assume they run from `Lexi/scripts/` directory:
```bash
cd Lexi/scripts
python script_name.py
```

### Environment Variables
Make sure `.env` is in root:
```
OPENAI_API_KEY=...
VECTOR_DB_PATH=../nepal_law_db
```

### ChromaDB Location
Default: `Lexi/nepal_law_db/`  
Can be configured via `VECTOR_DB_PATH` in .env

### Backward Compatibility
Old scripts still work! Just move them to `scripts/` first.

---

## 🚀 When Tests Complete

Once you verify all scripts work in scripts/ folder:

```bash
# Remove originals from root
rm ../add_criminal_law.py
rm ../chat_with_law.py
rm ../clean_text.py
rm ../cleaned_texts.py
rm ../Structural_Chunking.py
rm ../vectorize_data.py
rm ../streamlit_app.py  # or keep if needed

# Commit changes
git add -A
git commit -m "Organize legacy scripts into scripts/ folder"
git push origin branch1
```

---

## 📚 Which To Use Now?

### For Chat:
❌ chat_with_law.py (old)  
✅ React Frontend + FastAPI Backend (new)

### For Adding Laws:
✅ scripts/add_criminal_law.py (works great!)

### For Data Processing:
✅ scripts/clean_text.py  
✅ scripts/Structural_Chunking.py  
✅ scripts/vectorize_data.py

### For UI:
❌ scripts/streamlit_app.py (deprecated)  
✅ http://localhost:5173 (React frontend)

---

## 🔧 Troubleshooting

### Scripts can't find ChromaDB
```bash
# Make sure running from scripts/ folder
cd scripts
python vectorize_data.py

# If still fails, check VECTOR_DB_PATH in .env
```

### Import errors
```bash
# Make sure dependencies installed
pip install -r ../backend/requirements.txt
```

### Path errors
```bash
# Verify relative paths are correct
# If at scripts/, data is at ../data/
```

---

## ✅ Migration Checklist

- [ ] Read this guide
- [ ] Create scripts/ backup
- [ ] Copy files to scripts/
- [ ] Update paths if needed
- [ ] Test each script works
- [ ] Remove originals from root
- [ ] Update .gitignore
- [ ] Commit changes
- [ ] Test backend still works
- [ ] Verify frontend connects
- [ ] Documentation complete

---

## 📞 References

- **How to run scripts:** scripts/README.md
- **Data organization:** data/README.md
- **Backend API:** docs/API.md
- **Project structure:** PROJECT_STRUCTURE.md

---

**Your project will be cleaner and better organized!** 🎉
