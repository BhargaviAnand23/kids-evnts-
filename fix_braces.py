import re
files = [
    r'src\app\events\[id]\page.tsx', 
    r'src\app\parent\dashboard\page.tsx', 
    r'src\app\booking\confirmation\[id]\page.tsx', 
    r'src\components\reactbits\FeaturedCarousel.tsx'
]
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    changed = False
    for i, line in enumerate(lines):
        if '}' in line and '/>' in line:
            # Fixes
            old_line = lines[i]
            lines[i] = re.sub(r'\"\s*\}\s*\}\s*/>', r'" />', lines[i])
            lines[i] = re.sub(r'\}\s*\}\s*/>', r'} />', lines[i])
            lines[i] = re.sub(r'`\s*\}\s*/>', r'`} />', lines[i])
            if old_line != lines[i]:
                changed = True
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print('Fixed ' + path)
