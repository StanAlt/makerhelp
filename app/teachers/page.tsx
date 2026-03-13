import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find a Laser Expert — MakerHelp',
  description:
    'Browse vetted laser engraving experts. Get live video help with LightBurn, xTool, Glowforge, OMTech, and more.',
}

const LASER_TYPE_LABELS: Record<string, string> = {
  diode: 'Diode',
  co2: 'CO2',
  fiber: 'Fiber',
  uv: 'UV',
  galvo: 'Galvo',
}

export default async function TeachersDirectoryPage() {
  const supabase = createClient()

  const { data: teachers } = await supabase
    .from('teacher_profiles')
    .select(
      `*, profiles!inner(full_name, avatar_url), teacher_equipment(*), teacher_specialties(*)`
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const hasTeachers = teachers && teachers.length > 0

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Laser Expert</h1>
          <p className="text-gray-500 mt-1">
            Book a live video session with a vetted laser expert.
          </p>
        </div>

        {/* Filter Bar (placeholder) */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            disabled
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-50"
          >
            <option>Laser Type</option>
          </select>
          <select
            disabled
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-50"
          >
            <option>Brand</option>
          </select>
          <select
            disabled
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-50"
          >
            <option>Specialty</option>
          </select>
          <span className="text-xs text-gray-400 self-center ml-2">
            Filters coming soon
          </span>
        </div>

        {!hasTeachers ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-4">🔭</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No experts yet
            </h2>
            <p className="text-gray-500 mb-6">
              Be the first expert on MakerHelp — Apply to Teach
            </p>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Apply to Teach
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => {
              const profile = teacher.profiles as unknown as {
                full_name: string
                avatar_url: string | null
              }
              const hourlyRate = teacher.hourly_rate_cents / 100
              const equipmentSummary = (teacher.teacher_equipment || [])
                .slice(0, 2)
                .map(
                  (eq: { brand: string; laser_type: string }) =>
                    `${eq.brand} (${LASER_TYPE_LABELS[eq.laser_type] || eq.laser_type})`
                )
                .join(', ')
              const specialties = (teacher.teacher_specialties || []).slice(0, 3)

              return (
                <Link
                  key={teacher.id}
                  href={`/teachers/${teacher.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">
                      {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {profile.full_name}
                      </h3>
                      <p className="text-sm text-blue-600 truncate">
                        {teacher.headline}
                      </p>
                    </div>
                  </div>

                  {equipmentSummary && (
                    <p className="text-xs text-gray-500 mb-2 truncate">
                      {equipmentSummary}
                      {(teacher.teacher_equipment || []).length > 2 &&
                        ` +${(teacher.teacher_equipment || []).length - 2} more`}
                    </p>
                  )}

                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {specialties.map((s: { id: string; specialty: string }) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          {s.specialty}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-sm font-medium text-gray-900">
                    From ${hourlyRate}/hr
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
