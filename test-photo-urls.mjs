import https from 'https';
// Verify the 5 extra categories not on the homepage
const candidates = [
  ['Arts & Crafts',    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60'],
  ['Drama & Theater',  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60'],
  ['Cooking & Baking', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=60'],
  ['STEM & Robotics',  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60'],
  ['Public Speaking',  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=60'],
];
function check(label, url) {
  return new Promise(resolve => {
    const req = https.get(url, res => { resolve({ label, status: res.statusCode, ok: res.statusCode === 200 }); res.resume(); });
    req.on('error', () => resolve({ label, status: 0, ok: false }));
    req.setTimeout(8000, () => { req.destroy(); resolve({ label, status: 0, ok: false, err: 'timeout' }); });
  });
}
const results = await Promise.all(candidates.map(([l, u]) => check(l, u)));
for (const r of results) console.log(`${r.ok ? '✅' : '❌'} ${r.label.padEnd(20)} HTTP ${r.status}`);
