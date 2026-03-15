'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in. Check your inbox for a confirmation link.')
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Check your email for a login link.')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-display font-medium text-ivory text-center mb-2">
          Log In to <span className="text-ember italic">MakerHelp</span>
        </h1>
        <p className="text-steel text-center text-sm mb-6">
          Expert laser help, live.
        </p>

        {message && (
          <div className="mb-4 p-3 border border-green-800 rounded-[4px] text-sm text-green-400 bg-green-900/20">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 border border-red-800 rounded-[4px] text-sm text-red-400 bg-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink} className="space-y-4">
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

          {mode === 'password' && (
            <div>
              <label className="block text-sm font-ui font-medium text-ivory mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-charcoal border border-steel rounded-[4px] text-ivory placeholder:text-steel focus:ring-2 focus:ring-ember focus:border-ember outline-none"
                placeholder="Your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-ember text-ivory rounded-[4px] font-ui font-medium hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading
              ? 'Signing in...'
              : mode === 'password'
              ? 'Sign In'
              : 'Send Magic Link'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'password' ? 'magic' : 'password')
            setError(null)
            setMessage(null)
          }}
          className="w-full mt-3 text-sm text-ember hover:underline"
        >
          {mode === 'password'
            ? 'Sign in with magic link instead'
            : 'Sign in with password instead'}
        </button>

        <p className="text-center text-sm text-steel mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-ember hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
