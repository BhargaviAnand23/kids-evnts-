import re
path = r'src\components\reactbits\FeaturedCarousel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'\}\s*`\s*/>', r'}`} />', content)
content = re.sub(r'\"\s*\}\s*\}\s*/>', r'" />', content)
content = re.sub(r'\"\s*\}\s*/>', r'" />', content)
content = re.sub(r'\}\s*\}\s*/>', r'} />', content)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
