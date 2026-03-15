import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import SettingsFilters from '@/components/settings/SettingsFilters'
import SettingCard from '@/components/settings/SettingCard'
import MaikaChat from '@/components/settings/MaikaChat'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Laser Settings Database — MakerHelp',
  description:
    'Free crowd-sourced laser cutter and engraver settings. Search by machine, material, and operation.',
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: {
    brand?: string
    model?: string
    category?: string
    material?: string
    operation?: string
    thickness_min?: string
    thickness_max?: string
  }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load filter options
  const { data: machines } = await supabase
    .from('machines')
    .select('*')
    .order('brand')
    .order('model')

  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .order('name')

  // Build settings query
  let query = supabase
    .from('settings')
    .select('*, machines(*), materials(*)')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(60)

  if (searchParams.brand) {
    const machineIds = machines
      ?.filter((m) => m.brand === searchParams.brand)
      .map((m) => m.id)
    if (machineIds?.length) {
      if (searchParams.model) {
        const modelIds = machines
          ?.filter((m) => m.brand === searchParams.brand && m.model === searchParams.model)
          .map((m) => m.id)
        if (modelIds?.length) query = query.in('machine_id', modelIds)
      } else {
        query = query.in('machine_id', machineIds)
      }
    }
  }

  if (searchParams.material) {
    const matIds = materials
      ?.filter((m) => m.name === searchParams.material)
      .map((m) => m.id)
    if (matIds?.length) query = query.in('material_id', matIds)
  } else if (searchParams.category) {
    const catIds = materials
      ?.filter((m) => m.category === searchParams.category)
      .map((m) => m.id)
    if (catIds?.length) query = query.in('material_id', catIds)
  }

  if (searchParams.operation) {
    query = query.eq('operation', searchParams.operation)
  }

  if (searchParams.thickness_min) {
    query = query.gte('thickness_mm', Number(searchParams.thickness_min))
  }
  if (searchParams.thickness_max) {
    query = query.lte('thickness_mm', Number(searchParams.thickness_max))
  }

  const { data: settings } = await query

  // Get vote counts for each setting
  const settingIds = settings?.map((s) => s.id) ?? []
  let voteCounts: Record<string, { helpful: number; not_helpful: number }> = {}
  let userVotes: Record<string, string> = {}

  if (settingIds.length) {
    const { data: votes } = await supabase
      .from('setting_votes')
      .select('setting_id, vote')
      .in('setting_id', settingIds)

    if (votes) {
      for (const v of votes) {
        if (!voteCounts[v.setting_id]) voteCounts[v.setting_id] = { helpful: 0, not_helpful: 0 }
        voteCounts[v.setting_id][v.vote as 'helpful' | 'not_helpful']++
      }
    }

    if (user) {
      const { data: uv } = await supabase
        .from('setting_votes')
        .select('setting_id, vote')
        .eq('user_id', user.id)
        .in('setting_id', settingIds)
      if (uv) {
        for (const v of uv) userVotes[v.setting_id] = v.vote
      }
    }
  }

  return (
    <main className="min-h-screen bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-[48px] font-medium leading-[1.0] tracking-[-0.02em] text-ivory">
            Settings Database
          </h1>
          <p className="font-display text-xl italic text-ember mt-2">
            find your settings
          </p>
        </div>

        {/* Filters */}
        <SettingsFilters
          machines={machines ?? []}
          materials={materials ?? []}
          currentParams={searchParams}
        />

        {/* Results */}
        {!settings?.length ? (
          <div className="text-center py-20">
            <p className="font-ui text-lg text-sage mb-4">
              No settings found — be the first to submit one
            </p>
            <Link href="/settings/submit">
              <Button>Submit Your Settings</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {settings.map((s) => (
              <SettingCard
                key={s.id}
                setting={s}
                voteCounts={voteCounts[s.id] ?? { helpful: 0, not_helpful: 0 }}
                userVote={userVotes[s.id]}
                userId={user?.id}
              />
            ))}
          </div>
        )}

        {/* Submit CTA */}
        <div className="text-center mt-16">
          <Link href="/settings/submit">
            <Button>Submit Your Settings</Button>
          </Link>
        </div>
      </div>

      <MaikaChat />
    </main>
  )
}
