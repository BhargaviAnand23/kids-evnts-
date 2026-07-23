import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where the return block starts
return_idx = content.find('  return (\n    <div className="flex flex-col gap-8 pb-20')
if return_idx == -1:
    return_idx = content.find('  return (\n')

# Keep everything before return_idx
head = content[:return_idx]

# New JSX body
jsx = """  return (
    <div className="flex flex-col gap-12 pb-20 bg-white">
      
      {/* 2. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side */}
          <div className="flex-1 flex flex-col gap-6 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-full text-xs font-bold text-purple-700 w-max mx-auto lg:mx-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Discovery platform for kids
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Make Every <br className="hidden lg:block" />
              <span className="text-[#7C3AED]">Weekend</span> Special!
            </h1>
            
            <p className="text-lg text-slate-700 font-medium max-w-xl mx-auto lg:mx-0">
              Kidspire connects youth and families with camps, sports clinics, arts workshops, and skill-building programs hosted by trusted local schools.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#7C3AED]" />
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-900 leading-tight">450+</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Events</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7C3AED]" />
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-900 leading-tight">50+</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Venues</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7C3AED]" />
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-900 leading-tight">2.5k+</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Families</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#7C3AED] text-[#7C3AED]" />
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-900 leading-tight">4.9/5</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rating</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 mt-4 max-w-2xl border border-white/50 backdrop-blur-md">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search activities..." className="w-full bg-slate-50 text-slate-900 font-semibold text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#7C3AED]" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <select value={selectedAgeBracket} onChange={(e) => setSelectedAgeBracket(e.target.value)} className="bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer">
                  {AGE_BRACKETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
                <div className="bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl px-4 py-3 cursor-pointer flex items-center gap-2 shrink-0">
                  <MapPin className="w-4 h-4 text-[#7C3AED]" /> Location
                </div>
                <button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center gap-2 shrink-0">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 w-full relative min-h-[500px] flex justify-center items-center">
            {/* Center Photo */}
            <div className="w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative z-10 transform rotate-2">
              <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80" alt="Child playing sports" className="w-full h-full object-cover" />
            </div>

            {/* Floating Cards */}
            <div className="absolute top-8 left-0 lg:-left-4 bg-white p-2 rounded-xl shadow-xl flex items-center gap-3 z-20 animate-bounce duration-3000 w-[170px] -rotate-3">
              <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-lg object-cover" alt="Dance"/>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-900 leading-tight">Hip Hop Class</span>
                <span className="text-[9px] text-[#7C3AED] font-bold uppercase">This Weekend</span>
              </div>
            </div>

            <div className="absolute bottom-16 left-4 lg:-left-8 bg-white p-2 rounded-xl shadow-xl flex items-center gap-3 z-20 animate-bounce duration-4000 w-[170px] delay-150 rotate-3">
              <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-lg object-cover" alt="Music"/>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-900 leading-tight">Piano Basics</span>
                <span className="text-[9px] text-[#7C3AED] font-bold uppercase">Tomorrow</span>
              </div>
            </div>

            <div className="absolute top-1/2 right-10 lg:-right-4 bg-white p-2 rounded-xl shadow-xl flex items-center gap-3 z-20 animate-bounce duration-5000 w-[160px] delay-300 rotate-6 transform -translate-y-1/2">
              <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-lg object-cover" alt="Art"/>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-900 leading-tight">Clay Art</span>
                <span className="text-[9px] text-[#7C3AED] font-bold uppercase">Next Week</span>
              </div>
            </div>

            {/* Vertical Stack Pills */}
            <div className="absolute right-0 lg:-right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-0">
              <div className="bg-emerald-100 text-emerald-800 rounded-full py-2 px-4 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform text-[11px] font-bold whitespace-nowrap">
                <CheckCircle className="w-4 h-4" /> Book in Minutes
              </div>
              <div className="bg-blue-100 text-blue-800 rounded-full py-2 px-4 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform text-[11px] font-bold whitespace-nowrap">
                <Zap className="w-4 h-4" /> QR Tickets
              </div>
              <div className="bg-purple-100 text-purple-800 rounded-full py-2 px-4 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform text-[11px] font-bold whitespace-nowrap">
                <Shield className="w-4 h-4" /> Safe & Verified
              </div>
              <div className="bg-orange-100 text-orange-800 rounded-full py-2 px-4 shadow-sm flex items-center gap-2 hover:scale-105 transition-transform text-[11px] font-bold whitespace-nowrap">
                <Star className="w-4 h-4" /> Parent Approved
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. EXPLORE BY CATEGORY */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Explore by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {[
            { id: 'Football', label: 'Football', icon: Trophy, bg: 'bg-[#556b2f]' },
            { id: 'Basketball', label: 'Basketball', icon: Zap, bg: 'bg-orange-600' },
            { id: 'Dance', label: 'Dance', icon: Users, bg: 'bg-fuchsia-600' },
            { id: 'Swimming', label: 'Swimming', icon: Compass, bg: 'bg-blue-600' },
            { id: 'Skating', label: 'Skating', icon: Zap, bg: 'bg-indigo-600' },
            { id: 'Chess', label: 'Chess', icon: BookOpen, bg: 'bg-slate-900' },
            { id: 'Cricket', label: 'Cricket', icon: Trophy, bg: 'bg-green-600' },
            { id: 'Music', label: 'Music', icon: Music, bg: 'bg-purple-900' },
            { id: 'Martial Arts', label: 'Martial Arts', icon: Shield, bg: 'bg-slate-600' },
            { id: 'Cycling', label: 'Cycling', icon: Zap, bg: 'bg-red-600' },
            { id: 'Yoga & Fitness', label: 'Yoga & Fitness', icon: Heart, bg: 'bg-rose-500' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'All' : cat.id)}
              className={`relative w-36 h-40 rounded-2xl flex flex-col items-center justify-center gap-4 shrink-0 shadow-md cursor-pointer transition-all duration-300 border-4 ${selectedCategory === cat.id ? 'border-[#7C3AED] scale-105' : 'border-transparent hover:-translate-y-2'} ${cat.bg}`}
            >
              <cat.icon className="w-12 h-12 text-white" strokeWidth={1.5} />
              <span className="text-sm font-black text-white tracking-wide text-center px-2 leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. TRENDING EVENTS */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
        <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
          Trending Events
          <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black uppercase tracking-widest rounded-full animate-pulse border border-red-200">
            Live
          </span>
        </h2>
        
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
          {['All', 'Sports', 'Dance', 'Music', 'Outdoor', 'More'].map(tab => {
            const isActive = selectedCategory === tab || (tab === 'All' && selectedCategory === 'All')
            return (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 shadow-sm ${
                  isActive
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#7C3AED] hover:text-[#7C3AED]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col xl:flex-row gap-8 mt-2">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </div>
            ) : events.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 w-full h-[400px]">
                <Calendar className="w-12 h-12 text-slate-300" />
                <h3 className="text-xl font-black text-slate-900">No Events Found</h3>
                <p className="text-sm text-slate-500 font-semibold">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="mt-2 text-[#7C3AED] font-bold text-sm hover:underline">Clear all filters</button>
              </div>
            ) : (
              <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, idx) => {
                  const formattedPrice = event.price === 0 ? 'Free' : `$${Number(event.price).toFixed(2)}`
                  const formattedDate = new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  
                  const badges = [
                    { t: 'Popular', c: 'bg-orange-500 text-white' },
                    { t: 'Hot', c: 'bg-red-500 text-white' },
                    { t: 'New', c: 'bg-green-500 text-white' },
                    { t: 'Trending', c: 'bg-[#7C3AED] text-white' }
                  ]
                  const badge = badges[idx % badges.length]

                  return (
                    <div key={event.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[400px] group">
                      
                      <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                        <img src={event.image_url || DEFAULT_FALLBACK_IMAGE} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = DEFAULT_FALLBACK_IMAGE }} />
                        <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded shadow-sm uppercase tracking-wider ${badge.c}`}>
                          {badge.t}
                        </span>
                        <button onClick={(e) => toggleWishlist(e, event.id)} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all z-10">
                          <Heart className={`w-4 h-4 ${savedEventIds.has(event.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-black text-[#7C3AED]">
                            <span>{formattedDate} • {event.event_time.substring(0,5)}</span>
                          </div>
                          <Link href={`/events/${event.id}`}>
                            <h3 className="font-black text-slate-900 text-lg leading-tight hover:text-[#7C3AED] transition-colors line-clamp-2">
                              {event.title}
                            </h3>
                          </Link>
                          <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-500 mt-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{formatAgeBracket(event.age_bracket)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                          <span className="text-xl font-black text-slate-900">{formattedPrice}</span>
                          <Link href={`/events/${event.id}`}>
                            <button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors">
                              Book Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </AnimatedList>
            )}
          </div>
          
          {/* Mega Events Promo Sidebar */}
          <div className="w-full xl:w-[320px] shrink-0">
            <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-lg group">
              <img src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=600&auto=format&fit=crop&q=80" alt="Kids Sports Festival" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7C3AED] via-[#7C3AED]/70 to-transparent mix-blend-multiply opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-4">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-lg self-start border border-white/30">
                  Upcoming Mega Event
                </span>
                <h3 className="text-3xl font-black text-white leading-tight">
                  Summer Sports Festival 2026
                </h3>
                <div className="flex flex-col gap-2 text-purple-100 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Jul 10 - Jul 14, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>City Olympic Stadium</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-white text-[#7C3AED] hover:bg-purple-50 font-black py-3.5 rounded-xl text-sm transition-colors shadow-xl">
                  Know More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST BADGES ROW */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-wrap justify-between items-center gap-8">
          {[
            { t: 'Verified Partners', i: Shield, c: 'text-emerald-600 bg-emerald-50' },
            { t: 'Secure Payments', i: Lock, c: 'text-blue-600 bg-blue-50' },
            { t: 'Instant Confirmation', i: CheckCircle, c: 'text-purple-600 bg-purple-50' },
            { t: 'Live Seat Tracking', i: Zap, c: 'text-orange-600 bg-orange-50' },
            { t: '24/7 Parent Support', i: HelpCircle, c: 'text-rose-600 bg-rose-50' }
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 flex-1 min-w-[120px]">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${b.c}`}>
                <b.i className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-800">{b.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY PARENTS LOVE KIDSPIRE */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
          
          {/* Testimonials */}
          <div className="flex-1 overflow-hidden">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Why Parents Love Us</h2>
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
              {[
                { name: 'Sarah M.', role: 'Mom of 2', q: "Booking weekend camps used to be a nightmare of group chats and bad websites. Kidspire makes it 1-click easy!", p: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
                { name: 'David L.', role: 'Dad of 3', q: "The verified partner badge gives me total peace of mind. Both my boys found their favorite soccer clinics here.", p: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
                { name: 'Emily R.', role: 'Working Parent', q: "I love the live seat tracking! I can quickly see what's available for Saturday morning and book instantly.", p: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }
              ].map((t, i) => (
                <div key={i} className="w-[300px] shrink-0 snap-center bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 italic leading-relaxed">"{t.q}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                    <img src={t.p} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{t.name}</span>
                      <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="lg:w-1/3 shrink-0 flex flex-col">
            <h2 className="text-3xl font-black text-slate-900 mb-8">How It Works</h2>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-8 flex-1 justify-center">
              {[
                { s: '1', t: 'Discover', d: 'Browse 450+ curated local events', i: Search },
                { s: '2', t: 'Book', d: 'Secure your spot in seconds', i: Check },
                { s: '3', t: 'Get Tickets', d: 'Receive mobile QR passes instantly', i: Zap },
                { s: '4', t: 'Enjoy', d: 'Make memories that last forever', i: Heart }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100 shadow-sm relative">
                    <step.i className="w-5 h-5" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">{step.s}</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-base font-black text-slate-900">{step.t}</span>
                    <span className="text-xs font-semibold text-slate-500">{step.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER CTA BANNER */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="w-full bg-gradient-to-r from-[#7C3AED] to-indigo-600 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Abstract background blobs */}
          <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-white opacity-10 blur-3xl transform rotate-12 pointer-events-none"></div>
          <div className="absolute bottom-[-30%] left-[-10%] w-[30%] h-[100%] rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
          
          <div className="text-center lg:text-left text-white max-w-2xl relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
              Ready to Plan an <br className="hidden sm:block" /> Amazing Weekend?
            </h2>
            <p className="text-purple-100 text-lg mb-10 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
              Join thousands of parents discovering the best activities for their kids. Download our app or explore events online to get started today.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/events" className="bg-white text-[#7C3AED] font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-purple-50 hover:scale-105 transition-all text-sm w-full sm:w-auto text-center">
                Explore Events
              </Link>
              <button className="flex items-center justify-center gap-3 bg-purple-900/30 text-white font-black py-4 px-10 rounded-2xl backdrop-blur-sm border-2 border-white/20 hover:bg-purple-900/50 transition-all text-sm w-full sm:w-auto">
                Download App
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block relative w-72 h-80 shrink-0 z-10 perspective-1000">
             {/* Phone mockup */}
             <div className="absolute top-0 right-0 w-56 h-[350px] bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 p-2 transform rotate-12 rotate-x-12 origin-bottom-right">
                <div className="w-full h-full bg-purple-50 rounded-3xl overflow-hidden flex flex-col relative border border-slate-200">
                  <div className="w-full h-24 bg-[#7C3AED] relative">
                    <div className="w-1/3 h-4 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl"></div>
                  </div>
                  <div className="px-3 -mt-6">
                    <div className="w-full h-20 bg-white rounded-xl shadow-md p-2">
                       <div className="w-1/2 h-2 bg-slate-200 rounded mb-2"></div>
                       <div className="w-3/4 h-3 bg-[#7C3AED] rounded opacity-20"></div>
                    </div>
                  </div>
                  <div className="p-3 flex gap-2">
                    <div className="w-1/2 h-16 bg-white rounded-xl shadow-sm"></div>
                    <div className="w-1/2 h-16 bg-white rounded-xl shadow-sm"></div>
                  </div>
                </div>
             </div>
             
             {/* Store badges */}
             <div className="absolute bottom-10 -left-6 bg-slate-900 text-white font-black text-[10px] py-3 px-6 rounded-xl shadow-2xl border border-slate-800 transform -rotate-6">
                App Store
             </div>
             <div className="absolute bottom-24 -left-12 bg-slate-900 text-white font-black text-[10px] py-3 px-6 rounded-xl shadow-2xl border border-slate-800 transform -rotate-12">
                Google Play
             </div>
          </div>
        </div>
      </section>

    </div>
  )
}
"""

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(head + jsx)
