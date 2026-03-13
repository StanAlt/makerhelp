'use server'

import { createClient } from '@/lib/supabase/server'
import { createUniqueSlug } from '@/lib/utils/slug'
import { redirect } from 'next/navigation'

export interface EquipmentData {
  brand: string
  model: string
  laser_type: string
  wattage: string
  notes: string
}

export interface OnboardingFormData {
  fullName: string
  headline: string
  bio: string
  hourlyRate: number
  sessionLengths: number[]
  equipment: EquipmentData[]
  specialties: string[]
}

export async function submitTeacherProfile(formData: OnboardingFormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Generate unique slug
  const slug = await createUniqueSlug(supabase, formData.fullName)

  // Insert teacher profile
  const { error: profileError } = await supabase
    .from('teacher_profiles')
    .insert({
      id: user.id,
      slug,
      bio: formData.bio,
      headline: formData.headline,
      hourly_rate_cents: Math.round(formData.hourlyRate * 100),
      session_lengths: formData.sessionLengths,
      is_active: false,
      certification_level: 'none',
    })

  if (profileError) {
    return { error: `Failed to create profile: ${profileError.message}` }
  }

  // Insert equipment
  const equipmentRows = formData.equipment.map((eq) => ({
    teacher_id: user.id,
    brand: eq.brand,
    model: eq.model || null,
    laser_type: eq.laser_type,
    wattage: eq.wattage || null,
    notes: eq.notes || null,
  }))

  const { error: equipmentError } = await supabase
    .from('teacher_equipment')
    .insert(equipmentRows)

  if (equipmentError) {
    // Rollback: delete teacher profile
    await supabase.from('teacher_profiles').delete().eq('id', user.id)
    return { error: `Failed to save equipment: ${equipmentError.message}` }
  }

  // Insert specialties
  const specialtyRows = formData.specialties.map((specialty) => ({
    teacher_id: user.id,
    specialty,
  }))

  const { error: specialtyError } = await supabase
    .from('teacher_specialties')
    .insert(specialtyRows)

  if (specialtyError) {
    // Rollback
    await supabase.from('teacher_equipment').delete().eq('teacher_id', user.id)
    await supabase.from('teacher_profiles').delete().eq('id', user.id)
    return { error: `Failed to save specialties: ${specialtyError.message}` }
  }

  // Update full_name in profiles if changed
  await supabase
    .from('profiles')
    .update({ full_name: formData.fullName })
    .eq('id', user.id)

  return { success: true, slug }
}

export async function approveTeacher(teacherId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('teacher_profiles')
    .update({ is_active: true })
    .eq('id', teacherId)

  if (error) {
    return { error: `Failed to approve: ${error.message}` }
  }

  return { success: true }
}
