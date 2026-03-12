export type UserRole = 'maker' | 'teacher' | 'admin'
export type CertificationLevel = 'none' | 'verified' | 'certified' | 'master'
export type LaserType = 'diode' | 'co2' | 'fiber' | 'uv' | 'galvo'
export type SessionStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'refunded'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface TeacherProfile {
  id: string
  slug: string
  bio: string | null
  headline: string | null
  hourly_rate_cents: number
  session_lengths: number[]
  is_active: boolean
  certification_level: CertificationLevel
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  session_count: number
  avg_rating: number | null
  response_time_hours: number | null
  equipment?: TeacherEquipment[]
  specialties?: TeacherSpecialty[]
  profile?: Profile
  created_at: string
  updated_at: string
}

export interface TeacherEquipment {
  id: string
  teacher_id: string
  brand: string
  model: string | null
  laser_type: LaserType
  wattage: string | null
  notes: string | null
  created_at: string
}

export interface TeacherSpecialty {
  id: string
  teacher_id: string
  specialty: string
}

export interface Session {
  id: string
  teacher_id: string
  maker_id: string
  status: SessionStatus
  duration_minutes: number
  scheduled_at: string | null
  started_at: string | null
  ended_at: string | null
  amount_cents: number
  platform_fee_cents: number
  teacher_payout_cents: number
  stripe_payment_intent_id: string | null
  stripe_transfer_id: string | null
  whereby_room_url: string | null
  whereby_host_room_url: string | null
  problem_description: string | null
  machine_type: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  session_id: string
  maker_id: string
  teacher_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface WaitlistEntry {
  id: string
  email: string
  role: 'maker' | 'teacher' | null
  machine_type: string | null
  created_at: string
}
