'use client'

import { useState } from 'react'
import { approveTeacher } from '@/lib/actions/teacher-onboarding'

interface PendingTeacher {
  id: string
  headline: string | null
  created_at: string
  profiles: {
    full_name: string | null
    email: string
  }
  teacher_equipment?: { id: string }[]
}

export default function AdminTeacherList({
  teachers: initialTeachers,
}: {
  teachers: PendingTeacher[]
}) {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [approving, setApproving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (teacherId: string) => {
    setApproving(teacherId)
    setError(null)

    const result = await approveTeacher(teacherId)

    if (result.error) {
      setError(result.error)
      setApproving(null)
      return
    }

    setTeachers((prev) => prev.filter((t) => t.id !== teacherId))
    setApproving(null)
  }

  const handleReject = (teacherId: string) => {
    console.log('Reject teacher:', teacherId)
  }

  if (teachers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">All caught up! No pending applications.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {teachers.map((teacher) => {
        const profile = teacher.profiles as unknown as {
          full_name: string | null
          email: string
        }
        const equipmentCount = teacher.teacher_equipment?.length || 0

        return (
          <div
            key={teacher.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {profile.full_name || 'No name'}
                </h3>
                <span className="text-sm text-gray-400">{profile.email}</span>
              </div>
              <p className="text-sm text-gray-600 truncate mt-1">
                {teacher.headline || 'No headline'}
              </p>
              <div className="flex gap-4 mt-1 text-xs text-gray-400">
                <span>{equipmentCount} machine{equipmentCount !== 1 ? 's' : ''}</span>
                <span>
                  Submitted{' '}
                  {new Date(teacher.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleApprove(teacher.id)}
                disabled={approving === teacher.id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {approving === teacher.id ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={() => handleReject(teacher.id)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Reject
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
