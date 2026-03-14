'use server'

import { createClient } from '@/lib/supabase/server'
import { createUniqueSlug } from '@/lib/utils/slug'

interface SubmitTeacherProfileInput {
  fullName: string
  headline: string
  bio: string
  hourlyRateCents: number
  sessionLengths: number[]
  equipment: Array<{
    brand: string
    model: string
    laserType: string
    wattage: string
    notes: string
  }>
  specialties: string[]
}

export async function submitTeacherProfile(input: SubmitTeacherProfileInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  try {
    // 1. Update full name in profiles
    await supabase
      .from('profiles')
      .update({ full_name: input.fullName })
      .eq('id', user.id)

    // 2. Generate unique slug
    const slug = await createUniqueSlug(supabase, input.fullName)

    // 3. Insert teacher_profiles
    const { error: profileError } = await supabase
      .from('teacher_profiles')
      .insert({
        id: user.id,
        slug,
        headline: input.headline,
        bio: input.bio,
        hourly_rate_cents: input.hourlyRateCents,
        session_lengths: input.sessionLengths,
        is_active: false,
        certification_level: 'none',
      })

    if (profileError) return { error: profileError.message }

    // 4. Insert equipment
    if (input.equipment.length > 0) {
      const { error: equipError } = await supabase
        .from('teacher_equipment')
        .insert(
          input.equipment.map((e) => ({
            teacher_id: user.id,
            brand: e.brand,
            model: e.model || null,
            laser_type: e.laserType.toLowerCase(),
            wattage: e.wattage || null,
            notes: e.notes || null,
          }))
        )

      if (equipError) {
        await supabase.from('teacher_profiles').delete().eq('id', user.id)
        return { error: equipError.message }
      }
    }

    // 5. Insert specialties
    if (input.specialties.length > 0) {
      const { error: specError } = await supabase
        .from('teacher_specialties')
        .insert(
          input.specialties.map((s) => ({
            teacher_id: user.id,
            specialty: s,
          }))
        )

      if (specError) {
        await supabase.from('teacher_equipment').delete().eq('teacher_id', user.id)
        await supabase.from('teacher_profiles').delete().eq('id', user.id)
        return { error: specError.message }
      }
    }

    return { success: true, slug }
  } catch {
    return { error: 'Unexpected error. Please try again.' }
  }
}
