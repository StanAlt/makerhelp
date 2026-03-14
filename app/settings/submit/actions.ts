'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { generateSettingsSlug } from '@/lib/utils/slug'

export async function submitSettings(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const brand = formData.get('machine_brand') as string
  const model = formData.get('machine_model') as string
  const material = formData.get('material') as string
  const operation = formData.get('operation_type') as string

  const slug = generateSettingsSlug(brand, model, material, operation)

  const { error } = await supabase.from('laser_settings').insert({
    contributor_id: user.id,
    slug,
    machine_brand: brand,
    machine_model: model || null,
    laser_type: formData.get('laser_type') as string,
    machine_wattage: (formData.get('machine_wattage') as string) || null,
    material,
    material_thickness_mm: formData.get('material_thickness_mm')
      ? Number(formData.get('material_thickness_mm'))
      : null,
    material_brand: (formData.get('material_brand') as string) || null,
    material_finish: (formData.get('material_finish') as string) || null,
    operation_type: operation,
    speed: formData.get('speed') ? Number(formData.get('speed')) : null,
    power_percent: formData.get('power_percent')
      ? Number(formData.get('power_percent'))
      : null,
    passes: formData.get('passes') ? Number(formData.get('passes')) : 1,
    line_interval_mm: formData.get('line_interval_mm')
      ? Number(formData.get('line_interval_mm'))
      : null,
    focus_offset_mm: formData.get('focus_offset_mm')
      ? Number(formData.get('focus_offset_mm'))
      : null,
    air_assist: formData.get('air_assist') === 'on',
    software: (formData.get('software') as string) || null,
    dpi: formData.get('dpi') ? Number(formData.get('dpi')) : null,
    result_quality: (formData.get('result_quality') as string) || null,
    result_notes: (formData.get('result_notes') as string) || null,
  })

  if (error) {
    console.error('Settings submit error:', error)
    return
  }

  redirect(`/settings/${slug}`)
}
