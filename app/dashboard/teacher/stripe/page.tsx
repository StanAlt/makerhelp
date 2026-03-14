import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createStripeConnectLink } from './actions'

export default async function TeacherStripePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('stripe_onboarding_complete, stripe_account_id')
    .eq('id', user.id)
    .single()

  if (!teacherProfile) redirect('/onboarding/teacher')

  if (teacherProfile.stripe_onboarding_complete) {
    return (
      <main className="min-h-screen p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payment Setup</h1>
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            Your payment account is connected. You can accept bookings.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Set Up Payments</h1>
      <p className="text-gray-600 mb-6">
        Connect your bank account via Stripe to receive payments for your sessions.
        MakerHelp keeps 20% &mdash; you receive 80%.
      </p>
      <form action={createStripeConnectLink}>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Connect with Stripe &rarr;
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Powered by Stripe Connect. Your banking info is handled securely by Stripe.
      </p>
    </main>
  )
}
