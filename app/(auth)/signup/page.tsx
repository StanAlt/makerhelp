'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        setError('An account with this email already exists. Try logging in instead.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-display font-medium text-ivory mb-4">Check Your Email</h1>
          <p className="text-steel mb-6">
            We sent a confirmation link to <strong className="text-ivory">{email}</strong>.
            Click the link to confirm your account, then come back to log in.
          </p>
          <Link href="/login" className="text-ember hover:underline">
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-display font-medium text-ivory text-center mb-2">
          Join <span className="text-ember italic">MakerHelp</span>
        </h1>
        <p className="text-steel text-center text-sm mb-6">
          Connect with vetted laser engraving experts for live help.
        </p>

        {error && (
          <div className="mb-4 p-3 border border-red-800 rounded-[4px] text-sm text-red-400 bg-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-ui font-medium text-ivory mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-charcoal border border-steel rounded-[4px] text-ivory placeholder:text-steel focus:ring-2 focus:ring-ember focus:border-ember outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-ui font-medium text-ivory mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 bg-charcoal border border-steel rounded-[4px] text-ivory placeholder:text-steel focus:ring-2 focus:ring-ember focus:border-ember outline-none pr-16"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel hover:text-ivory"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-ui font-medium text-ivory mb-1">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-charcoal border border-steel rounded-[4px] text-ivory placeholder:text-steel focus:ring-2 focus:ring-ember focus:border-ember outline-none"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-ember text-ivory rounded-[4px] font-ui font-medium hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-steel mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-ember hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
