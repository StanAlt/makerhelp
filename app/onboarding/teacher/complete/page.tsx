import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TeacherOnboardingCompletePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('slug')
    .eq('id', user.id)
    .single()

  if (!teacherProfile) {
    redirect('/onboarding/teacher')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You&apos;re in the queue!
        </h1>
        <p className="text-gray-600 mb-6">
          Your profile is under review. We&apos;ll email you at{' '}
          <span className="font-medium text-gray-900">{user.email}</span>{' '}
          when you&apos;re approved and live on MakerHelp.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          In the meantime, you can preview your profile or update your info.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/teacher"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href={`/teachers/${teacherProfile.slug}`}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Preview My Profile
          </Link>
        </div>
      </div>
    </main>
  )
}
