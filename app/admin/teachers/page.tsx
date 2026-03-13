import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminTeacherList from './AdminTeacherList'

export default async function AdminTeachersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Double-check admin role (middleware also enforces this)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: pendingTeachers } = await supabase
    .from('teacher_profiles')
    .select(
      `*, profiles!inner(full_name, email)`
    )
    .eq('is_active', false)
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Teacher Approvals
        </h1>

        {!pendingTeachers || pendingTeachers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No pending teacher applications.</p>
          </div>
        ) : (
          <AdminTeacherList teachers={pendingTeachers} />
        )}
      </div>
    </main>
  )
}
