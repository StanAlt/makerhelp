import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import SettingsPageClient from '@/components/settings/SettingsPageClient'
import MaikaChat from '@/components/settings/MaikaChat'

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
  }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
    .limit(80)

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
    const matIds = materials?.filter((m) => m.name === searchParams.material).map((m) => m.id)
    if (matIds?.length) query = query.in('material_id', matIds)
  } else if (searchParams.category) {
    const catIds = materials?.filter((m) => m.category === searchParams.category).map((m) => m.id)
    if (catIds?.length) query = query.in('material_id', catIds)
  }

  if (searchParams.operation) query = query.eq('operation', searchParams.operation)

  const { data: settings } = await query

  // Vote counts
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

  // Compute brand stats for the brand grid
  const brandStats: Record<string, { models: number; settings: number; type: string }> = {}
  if (machines) {
    for (const m of machines) {
      if (!brandStats[m.brand]) brandStats[m.brand] = { models: 0, settings: 0, type: m.type }
      brandStats[m.brand].models++
    }
  }
  // Count approved settings per brand from all settings (not just filtered)
  const { data: allSettings } = await supabase
    .from('settings')
    .select('machine_id')
    .eq('approved', true)

  if (allSettings && machines) {
    const machineMap = new Map(machines.map((m) => [m.id, m.brand]))
    for (const s of allSettings) {
      const brand = machineMap.get(s.machine_id)
      if (brand && brandStats[brand]) brandStats[brand].settings++
    }
  }

  return (
    <main className="min-h-screen bg-charcoal">
      <SettingsPageClient
        machines={machines ?? []}
        materials={materials ?? []}
        settings={settings ?? []}
        brandStats={brandStats}
        voteCounts={voteCounts}
        userVotes={userVotes}
        userId={user?.id}
        currentParams={searchParams}
      />
      <MaikaChat />
    </main>
  )
}
