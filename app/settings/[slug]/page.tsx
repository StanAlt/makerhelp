import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { UpvoteButton } from '@/components/settings/UpvoteButton'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('laser_settings')
    .select('machine_brand, machine_model, material, operation_type, machine_wattage')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Settings Not Found — MakerHelp' }

  const title = `${data.machine_brand} ${data.machine_model ?? ''} ${data.operation_type} settings for ${data.material} — MakerHelp`
  const description = `Verified laser ${data.operation_type} settings for ${data.material} on a ${data.machine_brand}${data.machine_wattage ? ` ${data.machine_wattage}` : ''}. Speed, power, passes and more.`

  return { title, description }
}

export default async function SettingsEntryPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: setting } = await supabase
    .from('laser_settings')
    .select('*, profiles(full_name, is_teacher)')
    .eq('slug', params.slug)
    .single()

  if (!setting) notFound()

  // Check if user has upvoted
  let hasUpvoted = false
  if (user) {
    const { data: upvote } = await supabase
      .from('settings_upvotes')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('setting_id', setting.id)
      .maybeSingle()
    hasUpvoted = !!upvote
  }

  const contributor = setting.profiles as any

  // If contributor is a teacher, fetch their slug
  let teacherSlug: string | null = null
  if (contributor?.is_teacher) {
    const { data: tp } = await supabase
      .from('teacher_profiles')
      .select('slug')
      .eq('id', setting.contributor_id)
      .single()
    teacherSlug = tp?.slug ?? null
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link href="/settings" className="hover:text-gray-600">
          Settings Database
        </Link>
        {' / '}
        <span>
          {setting.machine_brand} &middot; {setting.material}
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {setting.machine_brand} {setting.machine_model} &mdash; {setting.material}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-gray-100 rounded text-sm capitalize">
            {setting.operation_type}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm capitalize">
            {setting.laser_type} laser
          </span>
          {setting.machine_wattage && (
            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
              {setting.machine_wattage}
            </span>
          )}
          {setting.is_verified && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              Expert Verified
            </span>
          )}
        </div>
      </div>

      {/* Settings table */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Settings</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {setting.speed != null && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Speed</p>
              <p className="text-xl font-bold">{setting.speed}</p>
              <p className="text-xs text-gray-400">mm/min</p>
            </div>
          )}
          {setting.power_percent != null && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Power</p>
              <p className="text-xl font-bold">{setting.power_percent}%</p>
            </div>
          )}
          {setting.passes != null && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Passes</p>
              <p className="text-xl font-bold">{setting.passes}</p>
            </div>
          )}
          {setting.line_interval_mm != null && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Line Interval
              </p>
              <p className="text-xl font-bold">{setting.line_interval_mm}mm</p>
            </div>
          )}
          {setting.focus_offset_mm != null && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Focus Offset
              </p>
              <p className="text-xl font-bold">{setting.focus_offset_mm}mm</p>
            </div>
          )}
          {setting.dpi != null && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">DPI</p>
              <p className="text-xl font-bold">{setting.dpi}</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t space-y-1 text-sm text-gray-600">
          {setting.material_thickness_mm != null && (
            <p>Material thickness: {setting.material_thickness_mm}mm</p>
          )}
          {setting.material_brand && <p>Material brand: {setting.material_brand}</p>}
          {setting.material_finish && (
            <p>Material finish: {setting.material_finish}</p>
          )}
          {setting.air_assist && <p>Air assist used</p>}
          {setting.software && <p>Software: {setting.software}</p>}
        </div>
      </div>

      {/* Result */}
      {(setting.result_quality || setting.result_notes) && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Result</h2>
          {setting.result_quality && (
            <p className="mb-1">
              Quality:{' '}
              <span
                className={`font-medium ${
                  setting.result_quality === 'perfect'
                    ? 'text-green-700'
                    : setting.result_quality === 'good'
                    ? 'text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                {setting.result_quality}
              </span>
            </p>
          )}
          {setting.result_notes && (
            <p className="text-gray-700">{setting.result_notes}</p>
          )}
        </div>
      )}

      {/* Upvote */}
      <div className="flex items-center gap-4 mb-8">
        <UpvoteButton
          settingId={setting.id}
          initialUpvotes={setting.upvotes}
          initialHasUpvoted={hasUpvoted}
          userId={user?.id}
        />
        <span className="text-sm text-gray-500">Was this helpful?</span>
      </div>

      {/* Contributor */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-sm text-gray-500 mb-1">Contributed by</p>
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {contributor?.full_name ?? 'Anonymous'}
          </span>
          {teacherSlug && (
            <Link
              href={`/teachers/${teacherSlug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Book a session with them &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-gray-700 mb-2">
          Need help dialing in settings for your specific project?
        </p>
        <Link
          href="/teachers"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Book a live session with a laser expert &rarr;
        </Link>
      </div>
    </main>
  )
}
