import os

pages = {
    'about': 'About Kidspire',
    'faq': 'Frequently Asked Questions',
    'contact': 'Contact Us',
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'refund-policy': 'Refund Policy',
    'safety-policy': 'Safety Policy',
    'how-it-works': 'How It Works',
    'help': 'Help Center'
}

template = """import React from 'react';

export default function {component_name}Page() {{
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-3xl bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">{title}</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
          <p>
            Welcome to the {title} page for Kidspire. This section is currently being updated with our latest policies and information.
          </p>
          <p>
            Kidspire is dedicated to making every weekend special by connecting families with the best local sports, arts, and hobby activities for youth. We partner with verified schools, clubs, and independent organizers to bring you a seamless booking experience.
          </p>
          <p>
            If you have immediate questions regarding our {title}, please feel free to reach out to our support team.
          </p>
        </div>
      </div>
    </div>
  );
}}
"""

for slug, title in pages.items():
    dir_path = f"src/app/{slug}"
    os.makedirs(dir_path, exist_ok=True)
    comp_name = slug.replace('-', ' ').title().replace(' ', '')
    with open(f"{dir_path}/page.tsx", "w", encoding="utf-8") as f:
        f.write(template.format(component_name=comp_name, title=title))
    
print("Info pages created.")
