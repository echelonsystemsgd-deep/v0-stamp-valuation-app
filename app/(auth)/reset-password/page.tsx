'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Lock, Loader2, ArrowRight, ShieldAlert } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    // Check if user is authenticated (meaning they came from a valid recovery code exchange)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkSession()
  }, [supabase])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        toast.error(error.message || 'Failed to update password')
        return
      }

      toast.success('Your password has been successfully reset!')
      router.refresh()
      router.push('/dashboard')
    })
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1D2E] bg-radial-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-forest-green/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gold/10 blur-[80px]" />

        <div className="max-w-md w-full space-y-8 z-10">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500" />
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-white">Invalid or Expired Session</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your password reset session has expired or is invalid. Please return to the login page and request a new reset link.
            </p>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 transition-all shadow-lg"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D2E] bg-radial-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-forest-green/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gold/10 blur-[80px]" />

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <Link href="/" className="inline-block font-serif text-3xl font-black text-white tracking-wider">
            Sell Your Stamps <span className="text-[#C5A059]">UK</span>
          </Link>
          <h2 className="mt-6 text-center text-4xl font-serif font-bold text-white">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Please enter your new secure password below
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />

          {isAuthenticated === null ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-[#C5A059] mb-4" />
              <p className="text-sm text-slate-300">Verifying session...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      id="new-password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
                      placeholder="Minimum 6 characters"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-new-password" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      id="confirm-new-password"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
                      placeholder="Re-enter new password"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14452F] transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" /> Updating Password...
                    </>
                  ) : (
                    <>
                      Update Password & Sign In <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
