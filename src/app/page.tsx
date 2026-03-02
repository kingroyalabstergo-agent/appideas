'use client'

import { useEffect, useState } from 'react'
import { supabase, AppIdea } from '@/lib/supabase'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  idea: 'bg-status-idea',
  researching: 'bg-status-researching',
  validated: 'bg-status-validated',
  building: 'bg-status-building',
  rejected: 'bg-status-rejected',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-score-green' : score >= 40 ? 'bg-score-yellow' : 'bg-score-red'
  return (
    <div className="w-full h-1.5 bg-cream-dark rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
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

  const stats = {
    total: ideas.length,
    validated: ideas.filter(i => i.status === 'validated').length,
    building: ideas.filter(i => i.status === 'building').length,
    rejected: ideas.filter(i => i.status === 'rejected').length,
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black">AppIdeas</h1>
        <p className="text-accent-light text-sm mt-1">validate before you build</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Validated', value: stats.validated },
          { label: 'Building', value: stats.building },
          { label: 'Rejected', value: stats.rejected },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-warm-border shadow-[0_1px_3px_var(--color-warm-shadow)]">
            <div className="text-xl font-semibold text-black">{s.value}</div>
            <div className="text-xs text-accent-light">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ideas List */}
      {loading ? (
        <div className="text-center text-accent-light py-12">Loading...</div>
      ) : ideas.length === 0 ? (
        <div className="text-center text-accent-light py-12">
          <p className="text-lg mb-1">No ideas yet</p>
          <p className="text-sm">Tap + to add your first idea</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map(idea => (
            <Link href={`/idea/${idea.id}`} key={idea.id}>
              <div className="bg-white rounded-xl p-4 border border-warm-border shadow-[0_1px_3px_var(--color-warm-shadow)] hover:shadow-[0_2px_8px_var(--color-warm-shadow)] transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-black truncate">{idea.name}</h3>
                      {idea.collab && (
                        <span className="text-[10px] text-accent-light border border-warm-border rounded-full px-1.5 py-0.5 shrink-0">
                          w/ {idea.collab}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-accent-light line-clamp-1">{idea.killer_feature}</p>
                  </div>
                  <span className={`${statusColors[idea.status]} text-white text-[10px] font-medium px-2 py-0.5 rounded-full ml-2 shrink-0`}>
                    {idea.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1">
                    <ScoreBar score={idea.validation_score} />
                  </div>
                  <span className="text-xs font-medium text-accent tabular-nums">{idea.validation_score}</span>
                  {idea.suggested_pricing && (
                    <span className="text-[10px] text-accent-light">{idea.suggested_pricing}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FAB */}
      <Link href="/add">
        <div className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-accent-light transition-colors cursor-pointer">
          +
        </div>
      </Link>
    </div>
  )
}
