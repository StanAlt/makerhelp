import { SupabaseClient } from '@supabase/supabase-js'

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function createUniqueSlug(
  supabase: SupabaseClient,
  name: string
): Promise<string> {
  const base = generateSlug(name)
  let slug = base
  let attempt = 1

  while (attempt <= 10) {
    const { data } = await supabase
      .from('teacher_profiles')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) return slug

    attempt++
    slug = `${base}-${attempt}`
  }

  return `${base}-${Date.now()}`
}

export function generateSettingsSlug(
  brand: string,
  model: string | null,
  material: string,
  operation: string
): string {
  const parts = [brand, model, material, operation].filter(Boolean).join(' ')
  return generateSlug(parts) + '-' + Date.now().toString(36)
}
