import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: { sessionId: string }
  searchParams: { payment?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', params.sessionId)
    .single()

  if (!session) notFound()

  // Must be a participant
  if (user.id !== session.maker_id && user.id !== session.teacher_id) {
    redirect('/dashboard')
  }

  const isTeacher = user.id === session.teacher_id
  const isMaker = user.id === session.maker_id
  const roomUrl = isTeacher ? session.whereby_host_room_url : session.whereby_room_url

  // Fetch other participant's name
  const otherId = isTeacher ? session.maker_id : session.teacher_id
  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', otherId)
    .single()

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      {searchParams.payment === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          Payment successful! Your session is confirmed. The teacher will be in touch to schedule a time.
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">
        Session with {otherProfile?.full_name ?? 'Participant'}
      </h1>

      <div className="mb-6 flex gap-3 flex-wrap">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            session.status === 'confirmed'
              ? 'bg-green-100 text-green-800'
              : session.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : session.status === 'completed'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
          {session.duration_minutes} minutes
        </span>
        {session.scheduled_at && (
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {new Date(session.scheduled_at).toLocaleString()}
          </span>
        )}
      </div>

      {/* Session details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
        {session.machine_type && (
          <p>
            <span className="text-gray-500">Machine:</span> {session.machine_type}
          </p>
        )}
        {session.problem_description && (
          <p>
            <span className="text-gray-500">Problem:</span>{' '}
            {session.problem_description}
          </p>
        )}
        <p>
          <span className="text-gray-500">Amount:</span> $
          {(session.amount_cents / 100).toFixed(2)}
          {isTeacher && (
            <span className="text-gray-400 text-sm ml-2">
              (you receive ${(session.teacher_payout_cents / 100).toFixed(2)})
            </span>
          )}
        </p>
      </div>

      {/* Video room */}
      {session.status === 'confirmed' && roomUrl && (
        <div className="mb-6">
          <a
            href={roomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium text-lg"
          >
            Join Video Call
          </a>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Opens in a new tab via Whereby. No download required.
          </p>
        </div>
      )}

      {session.status === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-6">
          <p className="text-yellow-800">
            {isMaker
              ? 'Waiting for payment confirmation. The video link will appear here shortly.'
              : 'New booking! Check your email and coordinate a time with the maker.'}
          </p>
        </div>
      )}

      {/* Leave review */}
      {session.status === 'completed' && isMaker && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="font-medium mb-2">How was your session?</p>
          <Link
            href={`/sessions/${session.id}/review`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Leave a Review
          </Link>
        </div>
      )}

      <div className="mt-6">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
          &larr; Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
