import re
import json

def refined_chunking(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. SPLIT: This splits by Article numbers (1. ) OR Schedule headers (Schedule-1)
    # We use a lookahead (?=) so the number/header stays inside the chunk.
    raw_splits = re.split(r'\n(?=\d+\.\s|Schedule-\s?\d+)', content)
    
    refined_chunks = []
    current_section = "Front Matter"
    is_past_amendments = False

    for block in raw_splits:
        clean_block = block.strip()
        if not clean_block: 
            continue

        # 2. TRIGGER: Skip the amendment dates at the very start
        if "PREAMBLE" in clean_block.upper() or "PART-1" in clean_block.upper():
            is_past_amendments = True
        
        if not is_past_amendments:
            continue

        # 3. METADATA: Detect if we entered a new Part or Schedule
        section_match = re.search(r'(Part-\s?\d+|Schedule-\s?\d+)', clean_block, re.IGNORECASE)
        if section_match:
            current_section = section_match.group(1).replace(" ", "")

        # 4. ARTICLE IDENTIFICATION: Extract the leading number
        art_num_match = re.search(r'^(\d+)\.', clean_block)
        art_num = art_num_match.group(1) if art_num_match else "N/A"
        
        # Special case for the Preamble text
        if "WE, THE SOVEREIGN PEOPLE" in clean_block:
            art_num = "Preamble"
            current_section = "Preamble"

        # 5. SAVE: Create the structured dictionary
        refined_chunks.append({
            "text": clean_block,
            "metadata": {
                "article_num": art_num,
                "section": current_section,
                "document": "Constitution of Nepal 2072"
            }
        })

    return refined_chunks

# --- EXECUTION BLOCK ---
if __name__ == "__main__":
    input_file = "cleaned_constitution.txt"  # Your text file from Step 1
    output_file = "final_structured_chunks.json"
    
    chunks = refined_chunking(input_file)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=4)
        
    print(f"✅ Step 2 Complete!")
    print(f"Created {len(chunks)} high-quality chunks.")
    print(f"Final data saved to: {output_file}")