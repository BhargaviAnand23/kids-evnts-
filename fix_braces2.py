import re
files = [
    r'src\app\events\[id]\page.tsx', 
    r'src\app\parent\dashboard\page.tsx', 
    r'src\app\booking\confirmation\[id]\page.tsx'
]
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Fix template string missing closing brace
    content = re.sub(r'\}\s*`\s*/>', r'}`} />', content)
    
    # 2. Fix double braces after quotes
    content = re.sub(r'\"\s*\}\s*\}\s*/>', r'" />', content)

    # 3. Fix single brace after quotes
    content = re.sub(r'\"\s*\}\s*/>', r'" />', content)

    # 4. Fix any other weird leftover
    content = re.sub(r'\}\s*\}\s*/>', r'} />', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
