import { redirect } from 'next/navigation'

// The new settings DB doesn't use slug-based detail pages.
// Redirect to the main settings page.
export default function SettingsSlugPage() {
  redirect('/settings')
}
