import os
import re

files_to_update = [
    r"src\app\events\[id]\page.tsx",
    r"src\app\booking\confirmation\[id]\page.tsx",
    r"src\app\parent\dashboard\page.tsx",
    r"src\components\reactbits\FeaturedCarousel.tsx"
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Check if 'next/image' is already imported
    if "import Image from 'next/image'" not in content and 'import Image from "next/image"' not in content:
        # Add import after the first import statement
        content = re.sub(
            r'(import .*?\n)', 
            r"\1import Image from 'next/image'\n", 
            content, 
            count=1
        )
        
    # Replace <img with <Image fill
    content = re.sub(r'<img', r'<Image fill', content)
    
    # Remove onError handler since next/image doesn't support e.currentTarget.src = ... directly
    content = re.sub(r'onError=\{.*?\}', '', content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated images in {file_path}")
