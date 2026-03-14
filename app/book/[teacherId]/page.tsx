import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { BookingForm } from '@/components/booking/BookingForm'

export default async function BookingPage({
  params,
}: {
  params: { teacherId: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?redirectTo=/book/${params.teacherId}`)

  const { data: teacher } = await supabase
    .from('teacher_profiles')
    .select(`
      id, slug, headline, hourly_rate_cents, session_lengths,
      accepts_bookings, stripe_onboarding_complete,
      profiles!inner(full_name)
    `)
    .eq('id', params.teacherId)
    .eq('is_active', true)
    .single()

  if (!teacher) notFound()

  if (!teacher.accepts_bookings || !teacher.stripe_onboarding_complete) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold mb-2">Not Available for Bookings</h1>
          <p className="text-gray-500">This expert isn&apos;t accepting bookings right now.</p>
        </div>
      </main>
    )
  }

  // Don't let teachers book themselves
  if (user.id === teacher.id) {
    redirect(`/teachers/${teacher.slug}`)
  }

  const profile = teacher.profiles as unknown as { full_name: string }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        Book a Session with {profile.full_name}
      </h1>
      <p className="text-gray-500 mb-8">{teacher.headline}</p>
      <BookingForm
        teacher={{
          id: teacher.id,
          hourly_rate_cents: teacher.hourly_rate_cents,
          session_lengths: teacher.session_lengths as number[],
          teacherName: profile.full_name,
        }}
        makerId={user.id}
      />
    </main>
  )
}
