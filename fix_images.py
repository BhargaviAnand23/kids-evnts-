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
    
    # We need to remove the stray '}' left over from the bad onError replacement.
    # It looks like:
    #                 className="w-full h-full object-cover"
    #                 }
    #               />
    # We can match `}\n              />` or similar.
    # Actually, the leftover string is ` e.currentTarget.src = DEFAULT_FALLBACK_IMAGE }}` or just `}`.
    # Let's see: `onError={(e) => { e.currentTarget.src = DEFAULT_FALLBACK_IMAGE }}`
    # `re.sub(r'onError=\{.*?\}', '', content)` replaced `onError={(e) => { e.currentTarget.src = DEFAULT_FALLBACK_IMAGE }`.
    # Leaving `}`
    
    # Let's fix this by finding all `<Image fill` and cleaning up inside.
    # A regex to remove a stray `}` before `/>`
    content = re.sub(r'\}\s+/>', r'/>', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {file_path}")
