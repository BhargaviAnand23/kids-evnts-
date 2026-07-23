import os
import re

target_dirs = ['src/app', 'src/components']
exclude_paths = [
    os.path.normpath('src/app/page.tsx'),
    os.path.normpath('src/components/Navbar.tsx'),
    os.path.normpath('src/components/Footer.tsx'),
    os.path.normpath('src/services/db.ts')
]

# Colors to replace
color_replacements = [
    (r'\btext-blue-(\d+)', r'text-purple-\1'),
    (r'\bbg-blue-(\d+)', r'bg-purple-\1'),
    (r'\bborder-blue-(\d+)', r'border-purple-\1'),
    (r'\bring-blue-(\d+)', r'ring-purple-\1'),
    (r'\bfrom-blue-(\d+)', r'from-purple-\1'),
    (r'\bto-blue-(\d+)', r'to-purple-\1'),
    
    (r'\btext-indigo-(\d+)', r'text-purple-\1'),
    (r'\bbg-indigo-(\d+)', r'bg-purple-\1'),
    (r'\bborder-indigo-(\d+)', r'border-purple-\1'),
    (r'\bring-indigo-(\d+)', r'ring-purple-\1'),
    (r'\bfrom-indigo-(\d+)', r'from-purple-\1'),
    (r'\bto-indigo-(\d+)', r'to-purple-\1'),
    
    (r'\btext-emerald-(\d+)', r'text-purple-\1'),
    (r'\bbg-emerald-(\d+)', r'bg-purple-\1'),
    (r'\bborder-emerald-(\d+)', r'border-purple-\1'),
    (r'\bring-emerald-(\d+)', r'ring-purple-\1'),
]

for d in target_dirs:
    for root, _, files in os.walk(d):
        for file in files:
            if not file.endswith('.tsx') and not file.endswith('.ts'): continue
            
            filepath = os.path.normpath(os.path.join(root, file))
            if any(filepath.endswith(ep) for ep in exclude_paths):
                continue
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            for pattern, repl in color_replacements:
                content = re.sub(pattern, repl, content)
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
print("Design consistency applied.")
