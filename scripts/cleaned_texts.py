import fitz  # PyMuPDF
import re

def extract_clean_text(pdf_path):
    doc = fitz.open("../data/data1.pdf")
    full_text = []

    print(f"Processing: {pdf_path} ({len(doc)} pages)")

    for page_num, page in enumerate(doc):
        # 1. Extract text from the page
        text = page.get_text("text")

        # 2. Basic Cleaning
        # Remove repeated headers/footers (customize these strings based on your PDF)
        # Example: if every page says "Constitution of Nepal 2072" at the top
        text = text.replace("Constitution of Nepal 2072", "")
        
        # Remove page numbers (matches digits at the start or end of lines)
        text = re.sub(r'^\d+\s*$', '', text, flags=re.MULTILINE)

        # 3. Handle extra whitespaces
        # Replaces multiple spaces with a single space, but keeps line breaks
        text = re.sub(r' +', ' ', text)

        # 4. Optional: Add a marker for where pages end (useful for chunking later)
        page_content = f"\n--- [PAGE {page_num + 1}] ---\n{text}"
        full_text.append(page_content)

    doc.close()
    return "".join(full_text)

# --- Execution ---
input_pdf = "../nepal_constitution.pdf" # Put your filename here
cleaned_output = extract_clean_text(input_pdf)

# Save to a .txt file for Step 2
with open("../cleaned_constitution.txt", "w", encoding="utf-8") as f:
    f.write(cleaned_output)

print("Extraction Complete! Data saved to cleaned_constitution.txt")