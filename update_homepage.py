import re

def update_db():
    with open('src/services/db.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Update category tags in SEED_EVENTS
    content = content.replace("category: 'STEM & Tech'", "category: 'Chess'")
    content = content.replace("category: 'Academic Workshops'", "category: 'Chess'")
    
    # Just in case, update titles if they sound too academic
    content = content.replace("title: 'Science Experiment Day'", "title: 'Chess Tournament'")
    content = content.replace("title: 'Introduction to Coding with Scratch'", "title: 'Chess Masterclass'")
    content = content.replace("description: 'Hands-on physics and chemistry experiments for kids. Build a mini volcano, make slime, and launch model rockets!'", "description: 'A fun chess tournament for kids of all levels.'")
    content = content.replace("description: 'Learn coding basics by building fun interactive games with Scratch block coding. Ideal for complete beginners.'", "description: 'Learn the basics of chess and practice with friends.'")

    with open('src/services/db.ts', 'w', encoding='utf-8') as f:
        f.write(content)

def update_page():
    with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace BENTO_CATEGORIES
    bento_match = re.search(r'const BENTO_CATEGORIES = \[.*?\]\n', content, flags=re.DOTALL)
    if bento_match:
        new_bento = """const BENTO_CATEGORIES = [
  { id: 'Football', label: 'Football', icon: Trophy, colorClass: 'bg-emerald-800' },
  { id: 'Basketball', label: 'Basketball', icon: Zap, colorClass: 'bg-orange-600' },
  { id: 'Dance', label: 'Dance', icon: Users, colorClass: 'bg-pink-600' },
  { id: 'Swimming', label: 'Swimming', icon: Compass, colorClass: 'bg-blue-600' },
  { id: 'Skating', label: 'Skating', icon: Zap, colorClass: 'bg-indigo-600' },
  { id: 'Chess', label: 'Chess', icon: BookOpen, colorClass: 'bg-slate-800' },
  { id: 'Cricket', label: 'Cricket', icon: Trophy, colorClass: 'bg-green-600' },
  { id: 'Music', label: 'Music', icon: Music, colorClass: 'bg-purple-800' },
  { id: 'Martial Arts', label: 'Martial Arts', icon: Shield, colorClass: 'bg-slate-600' },
  { id: 'Cycling', label: 'Cycling', icon: Zap, colorClass: 'bg-red-600' },
  { id: 'Yoga & Fitness', label: 'Yoga & Fitness', icon: Heart, colorClass: 'bg-rose-500' },
]
"""
        content = content[:bento_match.start()] + new_bento + content[bento_match.end():]

    # 2. Update category rendering
    # We look for the button mapping BENTO_CATEGORIES
    rendering_match = re.search(r'(<button[^>]*key=\{cat\.id\}[^>]*className={`relative w-40 h-48 rounded-2xl flex flex-col justify-between p-4 overflow-hidden shrink-0 shadow-md cursor-pointer group transition-all duration-300 \$\{cat.colorClass\} \$\{[^`]*`\}[^>]*>)(.*?)(</button>)', content, flags=re.DOTALL)
    if rendering_match:
        # Wait, the current page.tsx has the image implementation, NOT the one I assumed.
        pass
    else:
        # Actually in page.tsx currently it is:
        # className={`relative w-40 h-48 rounded-2xl overflow-hidden shrink-0 border shadow-md cursor-pointer group transition-all duration-300 ${
        #           isSelected ? 'border-purple-600 ring-4 ring-purple-600/30 scale-105' : 'border-transparent hover:-translate-y-2'
        #         }`}
        rendering_match2 = re.search(r'(<button[^>]*key=\{cat\.id\}[^>]*className={`relative w-40 h-48 rounded-2xl[^`]*`\}[^>]*>)(.*?)(</button>)', content, flags=re.DOTALL)
        if rendering_match2:
            button_open = rendering_match2.group(1)
            # We need to change the className to remove overflow-hidden and add cat.colorClass
            button_open = re.sub(r'rounded-2xl.*?group transition-all duration-300', 'rounded-2xl p-4 flex flex-col justify-between items-center group transition-all duration-300 border-none shadow-md ${cat.colorClass}', button_open)
            # Remove the old ${...} border classes
            button_open = re.sub(r'\$\{[\s\S]*?isSelected \? \'[^\']*\' : \'[^\']*\'\n\s*\}', "${isSelected ? 'ring-4 ring-purple-600/50 scale-105' : 'hover:-translate-y-2 shadow-lg'}", button_open)
    
            new_inner = """
                <div className="flex-1 flex items-center justify-center w-full">
                  <cat.icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <div className="w-full text-center mt-2">
                  <span className="text-sm font-black text-white tracking-wide block">
                    {cat.label}
                  </span>
                </div>
"""
            content = content[:rendering_match2.start()] + button_open + new_inner + rendering_match2.group(3) + content[rendering_match2.end():]


    # 3. Add Mega Events card to Trending Events section
    content = content.replace(
        '<AnimatedList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">',
        '<div className="flex flex-col lg:flex-row gap-8">\n          <div className="flex-1 min-w-0">\n            <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">'
    )
    content = content.replace(
        '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">\n            <EventCardSkeleton />\n            <EventCardSkeleton />\n            <EventCardSkeleton />\n            <EventCardSkeleton />\n          </div>',
        '<div className="flex flex-col lg:flex-row gap-8">\n          <div className="flex-1 min-w-0">\n            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">\n              <EventCardSkeleton />\n              <EventCardSkeleton />\n              <EventCardSkeleton />\n            </div>\n          </div>\n          <div className="w-full lg:w-1/4 shrink-0 hidden lg:block"></div>\n        </div>'
    )
    content = content.replace(
        '<div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3 w-full">\n            <Calendar className="w-10 h-10 text-slate-300" />\n            <h3 className="text-lg font-bold text-slate-900">No Events Found</h3>\n            <p className="text-xs text-slate-500 font-semibold">Try adjusting your filters.</p>\n          </div>',
        '<div className="flex flex-col lg:flex-row gap-8">\n          <div className="flex-1 min-w-0">\n            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3 w-full">\n              <Calendar className="w-10 h-10 text-slate-300" />\n              <h3 className="text-lg font-bold text-slate-900">No Events Found</h3>\n              <p className="text-xs text-slate-500 font-semibold">Try adjusting your filters.</p>\n            </div>\n          </div>\n          <div className="w-full lg:w-1/4 shrink-0 hidden lg:block"></div>\n        </div>'
    )

    mega_event_html = """
            </AnimatedList>
          </div>
          
          {/* UPCOMING MEGA EVENTS SIDEBAR */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-md group">
              <img src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=600&auto=format&fit=crop&q=80" alt="Kids Sports Festival" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-full self-start border border-white/30">
                  Mega Event
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Kids Sports Festival 2025
                </h3>
                <div className="flex flex-col gap-1 text-purple-100 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Jul 10 - Jul 14, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>City Olympic Stadium</span>
                  </div>
                </div>
                <button className="mt-2 w-full bg-white text-purple-700 hover:bg-purple-50 font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm">
                  Know More
                </button>
              </div>
            </div>
          </div>
        </div>
"""
    content = content.replace("            </AnimatedList>", mega_event_html)

    # 4. Update Filter Tabs in Trending events
    content = content.replace(
        "['All', 'Sports', 'STEM & Tech', 'Arts & Crafts', 'Music', 'Camps']",
        "['All', 'Football', 'Basketball', 'Dance', 'Chess', 'Music']"
    )

    with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_db()
    update_page()
    print("Done")
