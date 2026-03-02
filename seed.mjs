import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fsnfizztseeqsfykwsjp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbmZpenp0c2VlcXNmeWt3c2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ4NzUxMSwiZXhwIjoyMDg4MDYzNTExfQ.pOadJo7sIP6NRf_jRQcA581-TyfLh0nNX-QBv4GzYS8'
)

const ideas = [
  {
    name: 'AI Gym Form Feedback',
    description: 'Uses phone camera to analyze workout form, gives real-time corrections',
    killer_feature: 'AI form correction',
    secondary_features: ['Rep counting', 'Exercise library', 'Progress tracking'],
    status: 'idea',
    trend_score: 78, ease_score: 45, monetization_score: 72, validation_score: 65,
    app_store_category: 'Health & Fitness',
    suggested_pricing: '$4.99/mo or $29.99/yr',
    market_size: '$6B+ global fitness app market',
    competitor_count: 3,
    competitors: [
      { name: 'Tempo', rating: 4.5, downloads: '500K+', pricing: '$19.99/mo', revenue_estimate: '$100K/mo' },
      { name: 'Tonal', rating: 4.3, downloads: '100K+', pricing: '$49/mo', revenue_estimate: '$50K/mo' },
      { name: 'Onyx', rating: 4.6, downloads: '50K+', pricing: 'Free w/ IAP', revenue_estimate: '$25K/mo' },
    ],
  },
  {
    name: 'ChatGPT Humanizer',
    description: 'Takes AI-generated text and rewrites it to sound human',
    killer_feature: 'One-tap humanize',
    secondary_features: ['Tone adjustment', 'Grammar fix', 'Plagiarism check'],
    status: 'idea',
    trend_score: 92, ease_score: 70, monetization_score: 80, validation_score: 81,
    app_store_category: 'Productivity',
    suggested_pricing: '$3.99/mo or $24.99/yr',
    market_size: '$12B+ productivity tools market',
    competitor_count: 4,
    competitors: [
      { name: 'Undetectable AI', rating: 3.8, downloads: '100K+', pricing: '$9.99/mo', revenue_estimate: '$50K/mo' },
      { name: 'Quillbot', rating: 4.2, downloads: '1M+', pricing: '$8.33/mo', revenue_estimate: '$500K/mo' },
      { name: 'HIX Bypass', rating: 3.5, downloads: '50K+', pricing: '$6.99/mo', revenue_estimate: '$25K/mo' },
      { name: 'Humanize AI', rating: 3.9, downloads: '10K+', pricing: 'Free w/ IAP', revenue_estimate: '$10K/mo' },
    ],
  },
  {
    name: 'Vibe-coded Mini Games',
    description: 'Collection of simple, addictive mini-games all built with AI',
    killer_feature: 'New games added weekly',
    secondary_features: ['Leaderboards', 'Daily challenges', 'Share scores'],
    status: 'idea',
    trend_score: 70, ease_score: 75, monetization_score: 60, validation_score: 68,
    app_store_category: 'Games',
    suggested_pricing: 'Free + $2.99 remove ads',
    market_size: '$100B+ mobile gaming market',
    competitor_count: 3,
    competitors: [
      { name: 'GamePigeon', rating: 4.1, downloads: '10M+', pricing: 'Free', revenue_estimate: '$200K/mo' },
      { name: 'Mini Games', rating: 3.7, downloads: '500K+', pricing: 'Free w/ IAP', revenue_estimate: '$30K/mo' },
      { name: 'Bored Button', rating: 3.9, downloads: '100K+', pricing: 'Free', revenue_estimate: '$15K/mo' },
    ],
  },
  {
    name: 'Recipes for Seniors',
    description: 'Large text, simple UI, voice-guided cooking for elderly',
    killer_feature: 'Voice step-by-step',
    secondary_features: ['Large fonts', 'Simple navigation', 'Favorites list'],
    status: 'idea',
    trend_score: 55, ease_score: 75, monetization_score: 50, validation_score: 60,
    app_store_category: 'Food & Drink',
    suggested_pricing: '$2.99/mo or $19.99/yr',
    market_size: '$3B+ recipe/cooking app market',
    competitor_count: 3,
    competitors: [
      { name: 'BigOven', rating: 4.5, downloads: '1M+', pricing: 'Free w/ IAP', revenue_estimate: '$80K/mo' },
      { name: 'SideChef', rating: 4.6, downloads: '500K+', pricing: '$4.99/mo', revenue_estimate: '$40K/mo' },
      { name: 'Paprika', rating: 4.7, downloads: '100K+', pricing: '$4.99', revenue_estimate: '$30K/mo' },
    ],
  },
  {
    name: 'Cool Screen Recordings',
    description: 'Make screen recordings look professional with device frames, zoom effects, annotations',
    killer_feature: 'Auto-zoom on taps',
    secondary_features: ['Device frames', 'Annotations', 'Export presets'],
    status: 'idea',
    trend_score: 82, ease_score: 60, monetization_score: 78, validation_score: 73,
    app_store_category: 'Productivity',
    suggested_pricing: '$4.99/mo or $29.99/yr',
    market_size: '$12B+ productivity tools market',
    competitor_count: 3,
    competitors: [
      { name: 'Screen Studio', rating: 4.8, downloads: '50K+', pricing: '$89 one-time', revenue_estimate: '$100K/mo' },
      { name: 'CleanShot X', rating: 4.9, downloads: '100K+', pricing: '$29 one-time', revenue_estimate: '$80K/mo' },
      { name: 'Loom', rating: 4.3, downloads: '1M+', pricing: 'Free w/ IAP', revenue_estimate: '$500K/mo' },
    ],
  },
  {
    name: 'Kid Tracker',
    description: "Parents track child location + can send drawings/messages that appear on kid's phone",
    killer_feature: 'Interactive parent-child drawings',
    secondary_features: ['Location sharing', 'Safe zones', 'Messaging'],
    status: 'idea',
    trend_score: 65, ease_score: 40, monetization_score: 68, validation_score: 58,
    app_store_category: 'Family',
    suggested_pricing: '$4.99/mo or $34.99/yr',
    market_size: '$2B+ family safety app market',
    competitor_count: 3,
    competitors: [
      { name: 'Life360', rating: 4.6, downloads: '50M+', pricing: '$7.99/mo', revenue_estimate: '$10M/mo' },
      { name: 'Find My Kids', rating: 4.4, downloads: '10M+', pricing: '$2.99/mo', revenue_estimate: '$500K/mo' },
      { name: 'Family Link', rating: 3.8, downloads: '100M+', pricing: 'Free', revenue_estimate: 'N/A' },
    ],
  },
  {
    name: 'Counter App',
    description: 'App with many beautiful, customizable counters for tracking anything',
    killer_feature: 'Beautiful counter widgets',
    secondary_features: ['Custom themes', 'Widgets', 'History tracking'],
    status: 'idea',
    trend_score: 50, ease_score: 85, monetization_score: 55, validation_score: 63,
    app_store_category: 'Utilities',
    suggested_pricing: '$1.99 one-time or $0.99/mo',
    market_size: '$4B+ utility app market',
    competitor_count: 3,
    competitors: [
      { name: 'Tally Counter', rating: 4.5, downloads: '1M+', pricing: 'Free w/ IAP', revenue_estimate: '$20K/mo' },
      { name: 'Counter+', rating: 4.3, downloads: '500K+', pricing: '$1.99', revenue_estimate: '$10K/mo' },
      { name: 'Clicker', rating: 4.1, downloads: '100K+', pricing: 'Free', revenue_estimate: '$5K/mo' },
    ],
    collab: 'Marcel',
  },
]

const { data, error } = await supabase.from('app_ideas').insert(ideas).select('id, name')
if (error) console.error('Error:', error)
else console.log('Seeded:', data.map(d => d.name).join(', '))
