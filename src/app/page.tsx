'use client'

import { useEffect, useState } from 'react'
import { supabase, AppIdea } from '@/lib/supabase'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  idea: '#8B7B6E',
  researching: '#C4A24E',
  validated: '#6B8E5A',
  building: '#5A7B8E',
  rejected: '#B85C5C',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? '#6B8E5A' : score >= 40 ? '#C4A24E' : '#B85C5C'
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
  )
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState<AppIdea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('app_ideas')
        .select('*')
        .order('validation_score', { ascending: false })
      setIdeas(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px 120px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#1a1a1a' }}>AppIdeas</h1>
        <p style={{ fontSize: 14, color: '#8B7B6E', marginTop: 4 }}>validate before you build</p>
      </div>

      {/* Ideas List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#8B7B6E', padding: '48px 0' }}>Loading...</div>
      ) : ideas.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#8B7B6E', padding: '48px 0' }}>
          <p style={{ fontSize: 18, marginBottom: 4 }}>No ideas yet</p>
          <p style={{ fontSize: 14 }}>Tap + to add your first idea</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ideas.map(idea => (
            <Link href={`/idea/${idea.id}`} key={idea.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: '20px',
                border: '1px solid #E8E0D4',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>{idea.name}</h3>
                      {idea.collab && (
                        <span style={{ fontSize: 10, color: '#A89888', backgroundColor: '#F5F0E8', borderRadius: 99, padding: '2px 8px' }}>
                          w/ {idea.collab}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: '#8B7B6E' }}>{idea.killer_feature}</p>
                  </div>
                  <span style={{
                    backgroundColor: statusColors[idea.status] || '#8B7B6E',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: 99,
                    marginLeft: 12,
                    whiteSpace: 'nowrap',
                  }}>
                    {idea.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <ScoreBar score={idea.validation_score} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#6B5B4E', width: 28, textAlign: 'right' as const }}>{idea.validation_score}</span>
                </div>
                {idea.suggested_pricing && (
                  <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: '#6B5B4E' }}>{idea.suggested_pricing}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FAB */}
      <Link href="/add">
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          backgroundColor: '#6B5B4E',
          color: '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          boxShadow: '0 4px 12px rgba(107,91,78,0.3)',
          cursor: 'pointer',
        }}>
          +
        </div>
      </Link>
    </div>
  )
}
