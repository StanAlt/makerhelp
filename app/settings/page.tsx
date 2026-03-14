import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Laser Settings Database — MakerHelp',
  description:
    'Free crowd-sourced laser cutter and engraver settings. Search by machine, material, and operation type.',
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { brand?: string; material?: string; operation?: string; q?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('laser_settings')
    .select(
      `
      id, slug, machine_brand, machine_model, laser_type, machine_wattage,
      material, material_thickness_mm, operation_type,
      speed, power_percent, passes, result_quality, upvotes,
      is_verified, created_at,
      profiles(full_name)
    `
    )
    .order('upvotes', { ascending: false })
    .limit(50)

  if (searchParams.brand) query = query.ilike('machine_brand', `%${searchParams.brand}%`)
  if (searchParams.material) query = query.ilike('material', `%${searchParams.material}%`)
  if (searchParams.operation) query = query.eq('operation_type', searchParams.operation)
  if (searchParams.q) {
    query = query.or(
      `machine_brand.ilike.%${searchParams.q}%,material.ilike.%${searchParams.q}%,machine_model.ilike.%${searchParams.q}%`
    )
  }

  const { data: settings } = await query

  // Get distinct values for filters
  const { data: brands } = await supabase
    .from('laser_settings')
    .select('machine_brand')
    .order('machine_brand')

  const { data: materials } = await supabase
    .from('laser_settings')
    .select('material')
    .order('material')

  const uniqueBrands = Array.from(new Set(brands?.map((b) => b.machine_brand) ?? []))
  const uniqueMaterials = Array.from(new Set(materials?.map((m) => m.material) ?? []))

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Laser Settings Database</h1>
          <p className="text-gray-600 mt-1">
            Crowd-sourced, expert-verified settings for laser cutters and engravers.
          </p>
        </div>
        {user && (
          <Link
            href="/settings/submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
          >
            + Submit Settings
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <form className="flex gap-3 flex-wrap mb-8" method="GET">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search machine, material..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[12rem] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="brand"
          defaultValue={searchParams.brand}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Machines</option>
          {uniqueBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          name="material"
          defaultValue={searchParams.material}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Materials</option>
          {uniqueMaterials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          name="operation"
          defaultValue={searchParams.operation}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Operations</option>
          <option value="cut">Cut</option>
          <option value="engrave">Engrave</option>
          <option value="score">Score</option>
          <option value="fill">Fill</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {!settings?.length ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">
            No settings found. Be the first to contribute!
          </p>
          {user ? (
            <Link
              href="/settings/submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Settings
            </Link>
          ) : (
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Up to Contribute
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {settings.map((s: any) => (
            <Link key={s.id} href={`/settings/${s.slug}`}>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold">
                        {s.machine_brand} {s.machine_model}
                      </span>
                      {s.machine_wattage && (
                        <span className="text-sm text-gray-500">
                          {s.machine_wattage}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                        {s.laser_type}
                      </span>
                      {s.is_verified && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700">
                      <span className="capitalize font-medium">
                        {s.operation_type}
                      </span>
                      {' · '}
                      {s.material}
                      {s.material_thickness_mm && ` · ${s.material_thickness_mm}mm`}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Speed: {s.speed} mm/min · Power: {s.power_percent}% · Passes:{' '}
                      {s.passes}
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="text-lg font-bold">{s.upvotes}</div>
                    <div className="text-xs text-gray-400">helpful</div>
                    {s.result_quality && (
                      <div
                        className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                          s.result_quality === 'perfect'
                            ? 'bg-green-100 text-green-800'
                            : s.result_quality === 'good'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {s.result_quality}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
