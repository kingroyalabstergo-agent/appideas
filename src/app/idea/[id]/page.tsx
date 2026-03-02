'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, AppIdea } from '@/lib/supabase'
import Link from 'next/link'

const statuses = ['idea', 'researching', 'validated', 'building', 'rejected'] as const
const statusBg: Record<string, string> = {
  idea: '#8B7B6E', researching: '#C4A24E', validated: '#6B8E5A', building: '#5A7B8E', rejected: '#B85C5C',
}

function ScoreBarLabeled({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? '#6B8E5A' : score >= 40 ? '#C4A24E' : '#B85C5C'
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: '#8B7B6E' }}>{label}</span>
        <span style={{ fontWeight: 600, color: '#6B5B4E' }}>{score}</span>
      </div>
      <div style={{ width: '100%', height: 6, backgroundColor: '#F5F0E8', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 99, backgroundColor: color, width: `${score}%`, transition: 'all 0.3s' }} />
      </div>
    </div>
  )
}

const card = { backgroundColor: '#fff', borderRadius: 16, padding: 20, border: '1px solid #E8E0D4', marginBottom: 16 }
const sectionTitle = { fontSize: 11, fontWeight: 600 as const, color: '#8B7B6E', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 10 }

export default function IdeaDetail() {
  const params = useParams()
  const [idea, setIdea] = useState<AppIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState('')
  const [researching, setResearching] = useState(false)

  async function load() {
    const { data } = await supabase.from('app_ideas').select('*').eq('id', params.id).single()
    if (data) { setIdea(data); setNotes(data.notes || '') }
    setLoading(false)
  }

  useEffect(() => { load() }, [params.id])

  async function updateStatus(status: string) {
    await supabase.from('app_ideas').update({ status, updated_at: new Date().toISOString() }).eq('id', params.id)
    load()
  }

  async function saveNotes() {
    await supabase.from('app_ideas').update({ notes, updated_at: new Date().toISOString() }).eq('id', params.id)
    setEditing(false); load()
  }

  async function doResearch() {
    if (!idea) return
    setResearching(true)
    try {
      const res = await fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: idea.id, name: idea.name, description: idea.description, category: idea.app_store_category }) })
      if (res.ok) await load()
    } catch (e) { console.error(e) }
    setResearching(false)
  }

  if (loading) return <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px', color: '#8B7B6E' }}>Loading...</div>
  if (!idea) return <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px', color: '#8B7B6E' }}>Not found</div>

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px 120px' }}>
      <Link href="/" style={{ fontSize: 14, color: '#8B7B6E', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Back</Link>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a' }}>{idea.name}</h1>
          {idea.collab && <span style={{ fontSize: 10, color: '#A89888', backgroundColor: '#F5F0E8', borderRadius: 99, padding: '2px 8px' }}>w/ {idea.collab}</span>}
        </div>
        <p style={{ fontSize: 13, color: '#8B7B6E' }}>{idea.app_store_category}</p>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => updateStatus(s)} style={{
            fontSize: 12, padding: '6px 14px', borderRadius: 99, border: idea.status === s ? 'none' : '1px solid #E8E0D4',
            backgroundColor: idea.status === s ? statusBg[s] : 'transparent',
            color: idea.status === s ? '#fff' : '#8B7B6E', cursor: 'pointer',
          }}>{s}</button>
        ))}
      </div>

      {/* Description */}
      <div style={card}>
        <h2 style={sectionTitle}>Description</h2>
        <p style={{ fontSize: 14, color: '#1a1a1a', lineHeight: 1.6 }}>{idea.description}</p>
      </div>

      {/* Killer Feature */}
      <div style={card}>
        <h2 style={sectionTitle}>Killer Feature</h2>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{idea.killer_feature}</p>
        {idea.secondary_features?.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {idea.secondary_features.map((f, i) => (
              <span key={i} style={{ fontSize: 11, backgroundColor: '#F5F0E8', color: '#6B5B4E', padding: '3px 10px', borderRadius: 99 }}>{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* Scores */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Scores</h2>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{idea.validation_score}</span>
        </div>
        <ScoreBarLabeled label="Trend" score={idea.trend_score} />
        <ScoreBarLabeled label="Ease of Build" score={idea.ease_score} />
        <ScoreBarLabeled label="Monetization" score={idea.monetization_score} />
        {idea.market_size && <div style={{ fontSize: 12, color: '#8B7B6E', marginTop: 8 }}>Market: {idea.market_size}</div>}
        {idea.suggested_pricing && <div style={{ fontSize: 15, fontWeight: 600, color: '#6B5B4E', marginTop: 8 }}>{idea.suggested_pricing}</div>}
      </div>

      {/* Research */}
      <button onClick={doResearch} disabled={researching} style={{
        width: '100%', backgroundColor: '#6B5B4E', color: '#fff', fontSize: 14, fontWeight: 500,
        padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer', marginBottom: 16,
        opacity: researching ? 0.5 : 1,
      }}>{researching ? 'Researching...' : '🔍 Research Competitors'}</button>

      {/* Competitors */}
      {idea.competitors?.length > 0 && (
        <div style={card}>
          <h2 style={sectionTitle}>Competitors ({idea.competitor_count})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {idea.competitors.map((c, i) => (
              <div key={i} style={{ border: '1px solid #E8E0D4', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{c.name}</p>
                    <p style={{ fontSize: 11, color: '#8B7B6E' }}>{c.downloads} downloads</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>⭐ {c.rating}</p>
                    <p style={{ fontSize: 11, color: '#8B7B6E' }}>{c.pricing}</p>
                  </div>
                </div>
                {c.revenue_estimate && <p style={{ fontSize: 11, color: '#A89888', marginTop: 6 }}>Est. revenue: {c.revenue_estimate}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Notes</h2>
          <button onClick={() => editing ? saveNotes() : setEditing(true)} style={{ fontSize: 12, color: '#6B5B4E', background: 'none', border: 'none', cursor: 'pointer' }}>
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{
            width: '100%', fontSize: 14, border: '1px solid #E8E0D4', borderRadius: 10, padding: 10,
            backgroundColor: '#FFFDF7', minHeight: 80, outline: 'none', resize: 'none', fontFamily: 'inherit',
          }} />
        ) : (
          <p style={{ fontSize: 14, color: '#8B7B6E', whiteSpace: 'pre-wrap' }}>{idea.notes || 'No notes yet'}</p>
        )}
      </div>
    </div>
  )
}
