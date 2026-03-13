import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TeacherDashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('slug, is_active, stripe_onboarding_complete')
    .eq('id', user.id)
    .single()

  const hasProfile = !!teacherProfile

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Teacher Dashboard
        </h1>

        {/* Profile Completion Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Status
          </h2>
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
              <span className="text-gray-300 text-lg">&#9675;</span>
              <span className="text-gray-700">Payment setup (Stripe Connect)</span>
              <span className="text-xs text-gray-400 ml-auto">Coming soon</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        {hasProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h2>
            <div className="space-y-3">
              <Link
                href={`/teachers/${teacherProfile.slug}`}
                className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">
                  Preview My Profile
                </span>
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

        {/* Stripe Connect CTA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Payment Setup
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Connect your Stripe account to receive payouts from sessions.
          </p>
          <button
            disabled
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
          >
            Set Up Stripe Connect — Coming Soon
          </button>
        </div>
      </div>
    </main>
  )
}
