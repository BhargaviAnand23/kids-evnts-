import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lccvaztfsrlvnlisaveq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjY3ZhenRmc3Jsdm5saXNhdmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNjAzMDcsImV4cCI6MjA5OTgzNjMwN30.ZTPzi23rL2W7LLA0zGoGfMx1Ruzyc7sHmUwj-RmpG_E'
)

async function runTests() {
  console.log('\n=== Supabase Live Connection Test ===\n')

  // Test 1: All events
  console.log('--- Events ---')
  const { data: events, error: evErr } = await supabase
    .from('events')
    .select('id, title, category, age_bracket, status, is_sponsored, price')
    .order('event_date', { ascending: true })

  if (evErr) {
    console.error('❌ FAILED:', evErr.message, '| code:', evErr.code)
  } else {
    console.log(`✅ ${events.length} events found:`)
    events.forEach(e =>
      console.log(`   [${e.status}]${e.is_sponsored ? ' ⭐SPONSORED' : ''} ${e.title} | ${e.category} | ₹${e.price}`)
    )
  }

  // Test 2: Organizations
  console.log('\n--- Organizations ---')
  const { data: orgs, error: orgErr } = await supabase
    .from('organizations')
    .select('id, name, type, verified')

  if (orgErr) {
    console.error('❌ FAILED:', orgErr.message)
  } else {
    console.log(`✅ ${orgs.length} organizations found:`)
    orgs.forEach(o => console.log(`   [${o.verified ? '✓ verified' : 'unverified'}] ${o.name} (${o.type})`))
  }

  // Test 3: Reviews
  console.log('\n--- Reviews ---')
  const { data: reviews, error: revErr } = await supabase
    .from('reviews')
    .select('id, rating, comment, event_id')

  if (revErr) {
    console.error('❌ FAILED:', revErr.message)
  } else {
    console.log(`✅ ${reviews.length} reviews found`)
    reviews.forEach(r => console.log(`   ★${r.rating} on event ${r.event_id}: "${r.comment.substring(0, 60)}..."`))
  }

  // Test 4: Category filter (simulate homepage tab)
  console.log('\n--- Category filter: Football ---')
  const { data: football, error: footErr } = await supabase
    .from('events')
    .select('id, title')
    .ilike('category', 'football')
    .eq('status', 'approved')

  if (footErr) {
    console.error('❌ FAILED:', footErr.message)
  } else {
    console.log(`✅ ${football.length} football event(s) returned`)
    football.forEach(e => console.log(`   - ${e.title}`))
  }

  // Test 5: Approved-only (what homepage and explore use)
  console.log('\n--- Approved events count ---')
  const { count, error: countErr } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  if (countErr) {
    console.error('❌ FAILED:', countErr.message)
  } else {
    console.log(`✅ ${count} approved events visible to anonymous users`)
  }

  console.log('\n=== All tests complete ===\n')
}

runTests().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
