'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, AppIdea } from '@/lib/supabase'
import Link from 'next/link'

const statuses = ['idea', 'researching', 'validated', 'building', 'rejected'] as const
const statusColors: Record<string, string> = {
  idea: 'bg-status-idea',
  researching: 'bg-status-researching',
  validated: 'bg-status-validated',
  building: 'bg-status-building',
  rejected: 'bg-status-rejected',
}

function ScoreBarLabeled({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? 'bg-score-green' : score >= 40 ? 'bg-score-yellow' : 'bg-score-red'
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-accent-light">{label}</span>
        <span className="font-medium text-accent tabular-nums">{score}</span>
      </div>
      <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function IdeaDetail() {
  const params = useParams()
  const router = useRouter()
  const [idea, setIdea] = useState<AppIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState('')
  const [researching, setResearching] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('app_ideas')
      .select('*')
      .eq('id', params.id)
      .single()
    if (data) {
      setIdea(data)
      setNotes(data.notes || '')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [params.id])

  async function updateStatus(status: string) {
    await supabase.from('app_ideas').update({ status, updated_at: new Date().toISOString() }).eq('id', params.id)
    load()
  }

  async function saveNotes() {
    await supabase.from('app_ideas').update({ notes, updated_at: new Date().toISOString() }).eq('id', params.id)
    setEditing(false)
    load()
  }

  async function doResearch() {
    if (!idea) return
    setResearching(true)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idea.id, name: idea.name, description: idea.description, category: idea.app_store_category }),
      })
      if (res.ok) await load()
    } catch (e) { console.error(e) }
    setResearching(false)
  }

  if (loading) return <div className="max-w-lg mx-auto px-5 py-8 text-accent-light">Loading...</div>
  if (!idea) return <div className="max-w-lg mx-auto px-5 py-8 text-accent-light">Not found</div>

  return (
    <div className="max-w-lg mx-auto px-5 py-8 pb-24">
      {/* Back */}
      <Link href="/" className="text-accent-light text-sm hover:text-accent mb-6 inline-block">← Back</Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-semibold text-black">{idea.name}</h1>
          {idea.collab && (
            <span className="text-[10px] text-accent-light border border-warm-border rounded-full px-2 py-0.5">w/ {idea.collab}</span>
          )}
        </div>
        <p className="text-sm text-accent-light">{idea.app_store_category}</p>
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              idea.status === s
                ? `${statusColors[s]} text-white border-transparent`
                : 'border-warm-border text-accent-light hover:border-accent-light'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl p-4 border border-warm-border mb-4">
        <h2 className="text-xs font-medium text-accent-light uppercase tracking-wide mb-2">Description</h2>
        <p className="text-sm text-black leading-relaxed">{idea.description}</p>
      </div>

      {/* Killer Feature */}
      <div className="bg-white rounded-xl p-4 border border-warm-border mb-4">
        <h2 className="text-xs font-medium text-accent-light uppercase tracking-wide mb-2">Killer Feature</h2>
        <p className="text-sm text-black font-medium">{idea.killer_feature}</p>
        {idea.secondary_features && idea.secondary_features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {idea.secondary_features.map((f, i) => (
              <span key={i} className="text-[11px] bg-cream-dark text-accent px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="bg-white rounded-xl p-4 border border-warm-border mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-medium text-accent-light uppercase tracking-wide">Scores</h2>
          <span className="text-lg font-semibold text-black">{idea.validation_score}</span>
        </div>
        <ScoreBarLabeled label="Trend" score={idea.trend_score} />
        <ScoreBarLabeled label="Ease" score={idea.ease_score} />
        <ScoreBarLabeled label="Monetization" score={idea.monetization_score} />
        {idea.market_size && (
          <div className="mt-2 text-xs text-accent-light">Market: {idea.market_size}</div>
        )}
        {idea.suggested_pricing && (
          <div className="text-xs text-accent-light">Pricing: {idea.suggested_pricing}</div>
        )}
      </div>

      {/* Research Button */}
      <button
        onClick={doResearch}
        disabled={researching}
        className="w-full bg-accent text-white text-sm font-medium py-3 rounded-xl mb-4 hover:bg-accent-light transition-colors disabled:opacity-50 cursor-pointer"
      >
        {researching ? 'Researching...' : '🔍 Research Competitors'}
      </button>

      {/* Competitors */}
      {idea.competitors && idea.competitors.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-warm-border mb-4">
          <h2 className="text-xs font-medium text-accent-light uppercase tracking-wide mb-3">
            Competitors ({idea.competitor_count})
          </h2>
          <div className="space-y-3">
            {idea.competitors.map((c, i) => (
              <div key={i} className="border border-warm-border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-black">{c.name}</p>
                    <p className="text-[11px] text-accent-light">{c.downloads} downloads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">⭐ {c.rating}</p>
                    <p className="text-[11px] text-accent-light">{c.pricing}</p>
                  </div>
                </div>
                {c.revenue_estimate && (
                  <p className="text-[11px] text-accent-light mt-1">Est. revenue: {c.revenue_estimate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-white rounded-xl p-4 border border-warm-border mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-accent-light uppercase tracking-wide">Notes</h2>
          <button onClick={() => editing ? saveNotes() : setEditing(true)} className="text-xs text-accent hover:text-accent-light cursor-pointer">
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full text-sm border border-warm-border rounded-lg p-2 bg-cream min-h-[80px] outline-none focus:border-accent resize-none"
          />
        ) : (
          <p className="text-sm text-accent-light whitespace-pre-wrap">{idea.notes || 'No notes yet'}</p>
        )}
      </div>
    </div>
  )
}
