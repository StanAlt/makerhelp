import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MakerDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, is_teacher')
    .eq('id', user.id)
    .single()

  // Fetch upcoming sessions where user is the maker
  const { data: upcomingSessions } = await supabase
    .from('sessions')
    .select(`
      id, status, duration_minutes, scheduled_at, amount_cents,
      teacher_id
    `)
    .eq('maker_id', user.id)
    .in('status', ['pending', 'confirmed'])
    .order('scheduled_at', { ascending: true })
    .limit(5)

  // Fetch past sessions
  const { data: pastSessions } = await supabase
    .from('sessions')
    .select(`
      id, status, duration_minutes, scheduled_at, amount_cents,
      teacher_id
    `)
    .eq('maker_id', user.id)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(5)

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile?.full_name ?? 'Maker'}</h1>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
        </div>
        {profile?.is_teacher && (
          <Link href="/dashboard/teacher" className="text-sm text-blue-600 hover:underline">
            Switch to Teacher View &rarr;
          </Link>
        )}
      </div>

      <Link
        href="/teachers"
        className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 mb-8 font-medium"
      >
        Find an Expert &mdash; Book a Session
      </Link>

      {/* Upcoming sessions */}
      <section className="mb-8">
        <h2 className="font-semibold mb-3">Upcoming Sessions</h2>
        {!upcomingSessions?.length ? (
          <p className="text-gray-400 text-sm">
            No upcoming sessions.{' '}
            <Link href="/teachers" className="underline">
              Book one now.
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.map((s: any) => (
              <div key={s.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.duration_minutes}-min session</p>
                  <p className="text-sm text-gray-500">
                    {s.scheduled_at
                      ? new Date(s.scheduled_at).toLocaleString()
                      : 'Time TBD'}
                    {' · '}${(s.amount_cents / 100).toFixed(2)}
                  </p>
                </div>
                <Link
                  href={`/sessions/${s.id}`}
                  className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past sessions */}
      {(pastSessions?.length ?? 0) > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Past Sessions</h2>
          <div className="space-y-3">
            {pastSessions!.map((s: any) => (
              <div key={s.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.duration_minutes}-min session</p>
                  <p className="text-sm text-gray-500">
                    {new Date(s.scheduled_at).toLocaleDateString()}
                    {' · '}${(s.amount_cents / 100).toFixed(2)}
                  </p>
                </div>
                <Link
                  href={`/sessions/${s.id}`}
                  className="px-3 py-1 text-sm text-gray-500 hover:underline"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Become a teacher CTA */}
      {!profile?.is_teacher && (
        <section className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 mb-2">
            Are you a laser expert?{' '}
            <strong>Earn money sharing your knowledge.</strong>
          </p>
          <Link href="/onboarding/teacher" className="text-sm text-blue-600 hover:underline">
            Apply to become a MakerHelp expert &rarr;
          </Link>
        </section>
      )}

      <div className="mt-8 pt-6 border-t">
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
