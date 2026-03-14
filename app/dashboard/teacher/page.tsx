import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TeacherDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('slug, is_active, stripe_onboarding_complete, session_count, avg_rating')
    .eq('id', user.id)
    .single()

  const hasProfile = !!teacherProfile

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <Link href="/dashboard/maker" className="text-sm text-blue-600 hover:underline">
            Switch to Maker View &rarr;
          </Link>
        </div>

        {/* Profile Completion Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-lg">&#10003;</span>
              <span className="text-gray-700">Account created</span>
            </div>

            <div className="flex items-center gap-3">
              {hasProfile ? (
                <span className="text-green-500 text-lg">&#10003;</span>
              ) : (
                <span className="text-gray-300 text-lg">&#9675;</span>
              )}
              <span className="text-gray-700">Profile submitted</span>
              {!hasProfile && (
                <Link
                  href="/onboarding/teacher"
                  className="text-sm text-blue-600 hover:underline ml-auto"
                >
                  Complete now
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!hasProfile ? (
                <span className="text-gray-300 text-lg">&#9675;</span>
              ) : teacherProfile.is_active ? (
                <span className="text-green-500 text-lg">&#10003;</span>
              ) : (
                <span className="text-amber-500 text-lg">&#9203;</span>
              )}
              <span className="text-gray-700">
                {!hasProfile
                  ? 'Awaiting approval'
                  : teacherProfile.is_active
                  ? 'Profile live'
                  : 'Awaiting approval'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {hasProfile && teacherProfile.stripe_onboarding_complete ? (
                <span className="text-green-500 text-lg">&#10003;</span>
              ) : (
                <span className="text-gray-300 text-lg">&#9675;</span>
              )}
              <span className="text-gray-700">Payment setup (Stripe Connect)</span>
              {hasProfile && teacherProfile.is_active && !teacherProfile.stripe_onboarding_complete && (
                <Link
                  href="/dashboard/teacher/stripe"
                  className="text-sm text-blue-600 hover:underline ml-auto"
                >
                  Set up now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        {hasProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link
                href={`/teachers/${teacherProfile.slug}`}
                className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Preview My Profile</span>
                <span className="block text-sm text-gray-500">
                  See how makers will see your profile
                </span>
              </Link>

              <Link
                href="/dashboard/teacher/edit"
                className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Edit Profile</span>
                <span className="block text-sm text-gray-500">
                  Update your info, equipment, and specialties
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Stripe Connect */}
        {hasProfile && teacherProfile.is_active && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Setup</h2>
            {teacherProfile.stripe_onboarding_complete ? (
              <p className="text-green-700 text-sm">
                &#10003; Stripe Connect is active. You can accept bookings.
              </p>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-4">
                  Connect your Stripe account to receive payouts from sessions.
                </p>
                <Link
                  href="/dashboard/teacher/stripe"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Set Up Stripe Connect
                </Link>
              </>
            )}
          </div>
        )}

        {/* Stats */}
        {hasProfile && teacherProfile.is_active && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Stats</h2>
            <div className="flex gap-6">
              <div>
                <span className="text-2xl font-bold">{teacherProfile.session_count ?? 0}</span>
                <span className="text-sm text-gray-500 ml-1">sessions</span>
              </div>
              <div>
                <span className="text-2xl font-bold">
                  {teacherProfile.avg_rating ? Number(teacherProfile.avg_rating).toFixed(1) : '—'}
                </span>
                <span className="text-sm text-gray-500 ml-1">avg rating</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
