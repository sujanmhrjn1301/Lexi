# 🎯 Python File Migration Script

This script automates moving legacy Python files to the scripts folder.

## Files to Move

```
Root → scripts/

add_criminal_law.py          ✅ Keep
chat_with_law.py             ⚠️ Legacy, keep as reference
clean_text.py                ✅ Keep
cleaned_texts.py             ⚠️ Backup variant
Structural_Chunking.py       ✅ Keep
vectorize_data.py            ✅ Keep
streamlit_app.py             ❌ Deprecated, optional
```

## How to Migrate (Manual Steps)

### Using Command Line (PowerShell)

```powershell
# Navigate to project root
cd "d:\Python 2.0\Lexi"

# Move each file
Move-Item -Path "add_criminal_law.py" -Destination "scripts\"
Move-Item -Path "chat_with_law.py" -Destination "scripts\"
Move-Item -Path "clean_text.py" -Destination "scripts\"
Move-Item -Path "cleaned_texts.py" -Destination "scripts\"
Move-Item -Path "Structural_Chunking.py" -Destination "scripts\"
Move-Item -Path "vectorize_data.py" -Destination "scripts\"

# Optional: Move deprecated streamlit app
Move-Item -Path "streamlit_app.py" -Destination "scripts\"
```

### Using Command Line (Git Bash / Unix)

```bash
cd "d:/Python 2.0/Lexi"

# Move files
mv add_criminal_law.py scripts/
mv chat_with_law.py scripts/
mv clean_text.py scripts/
mv cleaned_texts.py scripts/
mv Structural_Chunking.py scripts/
mv vectorize_data.py scripts/
mv streamlit_app.py scripts/
```

## Verification

After moving, verify:

```bash
# Check scripts folder
ls scripts/ | grep -E "\.py$"

# Should see:
# add_criminal_law.py
# chat_with_law.py
# clean_text.py
# cleaned_texts.py
# Structural_Chunking.py
# vectorize_data.py
# streamlit_app.py
```

## Path Updates

Some scripts may have hardcoded paths. If they fail after moving:

### For scripts that reference `./data/`:
```python
# OLD: PDF_PATH = "./data/criminal_code_nepal.pdf"
# NEW: PDF_PATH = "../data/criminal_code_nepal.pdf"
```

### For scripts that reference `./nepal_law_db/`:
```python
# OLD: persist_directory = "./nepal_law_db"
# NEW: persist_directory = "../nepal_law_db"
```

## Testing After Migration

```bash
# Navigate to scripts folder
cd scripts

# Try running a script
python clean_text.py --help
python add_criminal_law.py --help
python vectorize_data.py --help
```

## Cleanup

After successful migration:

```bash
# Remove from root (if they still exist)
rm -f add_criminal_law.py chat_with_law.py clean_text.py cleaned_texts.py Structural_Chunking.py vectorize_data.py streamlit_app.py
```

Or verify they're gone:

```bash
ls *.py | grep -E "(add_criminal|chat_with|clean_text|Structural|vectorize|streamlit)"
# Should return nothing
```

## Results

Before:
```
Lexi/
├── add_criminal_law.py ❌
├── chat_with_law.py ❌
├── clean_text.py ❌
├── cleaned_texts.py ❌
├── streamlit_app.py ❌
├── Structural_Chunking.py ❌
├── vectorize_data.py ❌
└── scripts/
```

After:
```
Lexi/
└── scripts/
    ├── add_criminal_law.py ✅
    ├── chat_with_law.py ✅
    ├── clean_text.py ✅
    ├── cleaned_texts.py ✅
    ├── streamlit_app.py ✅
    ├── Structural_Chunking.py ✅
    └── vectorize_data.py ✅
```

---

See **FILE_MANAGEMENT.md** for detailed information about each script.
