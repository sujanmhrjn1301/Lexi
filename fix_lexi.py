#!/usr/bin/env python3
import re

# Read the file
with open('backend/routers/chats.py', 'r') as f:
    lines = f.readlines()

# Find and replace the section that handles non-legal queries
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Look for the "else:" that handles non-legal queries (after is_legal_query check)
    if 'print("💬 Processing general query with LLM...")' in line:
        # Replace this entire block with a refusal
        new_lines.append('            else:\n')
        new_lines.append('                print("🚫 Non-legal query detected. Refusing...")\n')
        new_lines.append('                ai_content = "I can only help with questions about Nepal\'s legal system. Please ask about Nepal laws, acts, sections, punishments, rights, or legal procedures."\n')
        
        # Skip the old code block
        i += 1
        while i < len(lines) and 'print(f"✅ General response generated:' not in lines[i]:
            i += 1
        i += 1  # Skip the print line too
        continue
    
    new_lines.append(line)
    i += 1

# Write the file back
with open('backend/routers/chats.py', 'w') as f:
    f.writelines(new_lines)

print('✅ Updated chats.py successfully')
