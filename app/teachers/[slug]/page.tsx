import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

const LASER_TYPE_LABELS: Record<string, string> = {
  diode: 'Diode',
  co2: 'CO2',
  fiber: 'Fiber',
  uv: 'UV',
  galvo: 'Galvo',
}

const CERT_BADGES: Record<string, { label: string; color: string }> = {
  verified: { label: 'Verified', color: 'bg-green-100 text-green-800' },
  certified: { label: 'Certified', color: 'bg-blue-100 text-blue-800' },
  master: { label: 'Master', color: 'bg-purple-100 text-purple-800' },
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const supabase = createClient()
  const { data: teacher } = await supabase
    .from('teacher_profiles')
    .select('headline, profiles!inner(full_name)')
    .eq('slug', params.slug)
    .single()

  if (!teacher) {
    return { title: 'Teacher Not Found — MakerHelp' }
  }

  const profile = teacher.profiles as unknown as { full_name: string }
  const firstName = profile.full_name?.split(' ')[0] || 'this expert'

  return {
    title: `${profile.full_name} — Laser Expert on MakerHelp`,
    description: `${teacher.headline}. Book a live video session with ${firstName} on MakerHelp.us`,
  }
}

export default async function TeacherProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: teacher } = await supabase
    .from('teacher_profiles')
    .select(
      `*, profiles!inner(full_name, email, avatar_url), teacher_equipment(*), teacher_specialties(*)`
    )
    .eq('slug', params.slug)
    .single()

  if (!teacher) {
    notFound()
  }

  const profile = teacher.profiles as unknown as {
    full_name: string
    email: string
    avatar_url: string | null
  }
  const isOwner = user?.id === teacher.id
  const isActive = teacher.is_active

  // Not active and not owner → show review message
  if (!isActive && !isOwner) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-700 mb-2">
            Profile Under Review
          </h1>
          <p className="text-gray-500">
            This teacher&apos;s profile is currently being reviewed and is not yet
            publicly available.
          </p>
        </div>
      </main>
    )
  }

  const hourlyRate = teacher.hourly_rate_cents / 100
  const certBadge = CERT_BADGES[teacher.certification_level]

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Under Review Banner */}
        {!isActive && isOwner && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-sm text-amber-800 font-medium">
              Your profile is under review. It will be visible to the public once approved.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 flex-shrink-0">
              {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.full_name}
                </h1>
                {certBadge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${certBadge.color}`}
                  >
                    {certBadge.label}
                  </span>
                )}
              </div>
              <p className="text-blue-600 mt-1">{teacher.headline}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              About
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{teacher.bio}</p>
          </div>

          {/* Equipment */}
          {teacher.teacher_equipment && teacher.teacher_equipment.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Equipment
              </h2>
              <div className="space-y-2">
                {teacher.teacher_equipment.map(
                  (eq: {
                    id: string
                    brand: string
                    model: string | null
                    laser_type: string
                    wattage: string | null
                  }) => (
                    <div
                      key={eq.id}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                      <span className="font-medium">{eq.brand}</span>
                      {eq.model && <span>{eq.model}</span>}
                      <span className="text-gray-400">—</span>
                      <span className="text-gray-500">
                        {LASER_TYPE_LABELS[eq.laser_type] || eq.laser_type}
                        {eq.wattage && `, ${eq.wattage}`}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Specialties */}
          {teacher.teacher_specialties &&
            teacher.teacher_specialties.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Specialties
                </h2>
                <div className="flex flex-wrap gap-2">
                  {teacher.teacher_specialties.map(
                    (s: { id: string; specialty: string }) => (
                      <span
                        key={s.id}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {s.specialty}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Pricing */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Session Rates
            </h2>
            <div className="space-y-1">
              {(teacher.session_lengths as number[])?.sort().map((length: number) => {
                const sessionRate = (hourlyRate * length) / 60
                return (
                  <p key={length} className="text-gray-700">
                    <span className="font-semibold">{length}-min session:</span>{' '}
                    ${sessionRate.toFixed(2)}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          {(teacher.session_count > 0 || teacher.avg_rating) && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Stats
              </h2>
              <div className="flex gap-6">
                {teacher.session_count > 0 && (
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {teacher.session_count}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">sessions</span>
                  </div>
                )}
                {teacher.avg_rating && (
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {Number(teacher.avg_rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">avg rating</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Book Button */}
          {!isOwner && teacher.stripe_onboarding_complete && (
            <Link
              href={`/book/${teacher.id}`}
              className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
            >
              Book a Session
            </Link>
          )}
          {!isOwner && !teacher.stripe_onboarding_complete && (
            <button
              disabled
              className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Payment Setup Pending &mdash; Check Back Soon
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
