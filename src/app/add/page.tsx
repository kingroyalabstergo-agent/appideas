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

export default function AddIdea() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    killer_feature: '',
    secondary_features: '',
    app_store_category: 'Productivity',
    collab: '',
  })

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)

    const { data, error } = await supabase.from('app_ideas').insert({
      name: form.name.trim(),
      description: form.description.trim(),
      killer_feature: form.killer_feature.trim(),
      secondary_features: form.secondary_features.split(',').map(s => s.trim()).filter(Boolean),
      app_store_category: form.app_store_category,
      collab: form.collab.trim() || null,
      status: 'idea',
    }).select().single()

    if (data) {
      // Trigger research in background
      fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, name: data.name, description: data.description, category: data.app_store_category }),
      }).catch(() => {})
      router.push(`/idea/${data.id}`)
    } else {
      console.error(error)
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <Link href="/" className="text-accent-light text-sm hover:text-accent mb-6 inline-block">← Back</Link>

      <h1 className="text-2xl font-semibold text-black mb-6">New Idea</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-accent-light uppercase tracking-wide block mb-1.5">App Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="w-full border border-warm-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-accent"
            placeholder="e.g. AI Gym Coach"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-accent-light uppercase tracking-wide block mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            className="w-full border border-warm-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-accent min-h-[80px] resize-none"
            placeholder="What does it do?"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-accent-light uppercase tracking-wide block mb-1.5">Killer Feature</label>
          <input
            type="text"
            value={form.killer_feature}
            onChange={e => update('killer_feature', e.target.value)}
            className="w-full border border-warm-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-accent"
            placeholder="The ONE feature that makes it special"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-accent-light uppercase tracking-wide block mb-1.5">Secondary Features</label>
          <input
            type="text"
            value={form.secondary_features}
            onChange={e => update('secondary_features', e.target.value)}
            className="w-full border border-warm-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-accent"
            placeholder="Comma separated"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-accent-light uppercase tracking-wide block mb-1.5">Category</label>
          <select
            value={form.app_store_category}
            onChange={e => update('app_store_category', e.target.value)}
            className="w-full border border-warm-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-accent"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-accent-light uppercase tracking-wide block mb-1.5">Collaborator</label>
          <input
            type="text"
            value={form.collab}
            onChange={e => update('collab', e.target.value)}
            className="w-full border border-warm-border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-accent"
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent text-white text-sm font-medium py-3 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Add Idea'}
        </button>
      </form>
    </div>
  )
}
