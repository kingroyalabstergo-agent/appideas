'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = [
  'Health & Fitness', 'Productivity', 'Games', 'Food & Drink',
  'Family', 'Utilities', 'Education', 'Entertainment',
  'Social Networking', 'Finance', 'Lifestyle', 'Photo & Video',
]

const inputStyle = {
  width: '100%', border: '1px solid #E8E0D4', borderRadius: 14, padding: '12px 14px',
  fontSize: 14, backgroundColor: '#fff', outline: 'none', fontFamily: 'inherit',
}
const labelStyle = { fontSize: 11, fontWeight: 600 as const, color: '#8B7B6E', textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }

export default function AddIdea() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', killer_feature: '', secondary_features: '',
    app_store_category: 'Productivity', collab: '',
  })

  function update(field: string, value: string) { setForm(f => ({ ...f, [field]: value })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const { data, error } = await supabase.from('app_ideas').insert({
      name: form.name.trim(), description: form.description.trim(), killer_feature: form.killer_feature.trim(),
      secondary_features: form.secondary_features.split(',').map(s => s.trim()).filter(Boolean),
      app_store_category: form.app_store_category, collab: form.collab.trim() || null, status: 'idea',
    }).select().single()
    if (data) {
      fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, name: data.name, description: data.description, category: data.app_store_category }) }).catch(() => {})
      router.push(`/idea/${data.id}`)
    } else { console.error(error); setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px 80px' }}>
      <Link href="/" style={{ fontSize: 14, color: '#8B7B6E', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Back</Link>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', marginBottom: 28 }}>New Idea</h1>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>App Name *</label>
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)} style={inputStyle} placeholder="e.g. AI Gym Coach" required />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: 'none' }} placeholder="What does it do?" />
        </div>
        <div>
          <label style={labelStyle}>Killer Feature</label>
          <input type="text" value={form.killer_feature} onChange={e => update('killer_feature', e.target.value)} style={inputStyle} placeholder="The ONE feature that makes it special" />
        </div>
        <div>
          <label style={labelStyle}>Secondary Features</label>
          <input type="text" value={form.secondary_features} onChange={e => update('secondary_features', e.target.value)} style={inputStyle} placeholder="Comma separated" />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.app_store_category} onChange={e => update('app_store_category', e.target.value)} style={inputStyle}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Collaborator</label>
          <input type="text" value={form.collab} onChange={e => update('collab', e.target.value)} style={inputStyle} placeholder="Optional" />
        </div>
        <button type="submit" disabled={saving} style={{
          width: '100%', backgroundColor: '#6B5B4E', color: '#fff', fontSize: 14, fontWeight: 500,
          padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer', opacity: saving ? 0.5 : 1,
        }}>{saving ? 'Saving...' : 'Add Idea'}</button>
      </form>
    </div>
  )
}
