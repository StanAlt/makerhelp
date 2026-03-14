import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { approveTeacher } from './actions'

export default async function AdminTeachersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: pending } = await supabase
    .from('teacher_profiles')
    .select(`
      id, slug, headline, created_at,
      profiles!inner(full_name, email),
      teacher_equipment(id)
    `)
    .eq('is_active', false)
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin — Pending Teacher Approvals</h1>

      {!pending || pending.length === 0 ? (
        <p className="text-gray-500">No pending approvals. All caught up!</p>
      ) : (
        <div className="space-y-4">
          {pending.map((t: any) => {
            const p = t.profiles as any
            const equipCount = (t.teacher_equipment as any[])?.length ?? 0

            return (
              <div key={t.id} className="border rounded-lg p-4 flex items-start justify-between bg-white">
                <div>
                  <p className="font-semibold">{p.full_name}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{t.headline}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {equipCount} machine{equipCount !== 1 ? 's' : ''}
                    {' · '}
                    Submitted {new Date(t.created_at).toLocaleDateString()}
                    {' · '}
                    <a href={`/teachers/${t.slug}`} target="_blank" className="underline">
                      Preview
                    </a>
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <form action={approveTeacher.bind(null, t.id)}>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </form>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
