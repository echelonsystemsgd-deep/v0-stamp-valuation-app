'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, User, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordSignedUp, setIsPasswordSignedUp] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const supabase = createClient()

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        toast.error(error.message || 'Registration failed')
        return
      }

      // If email confirmation is disabled/auto-confirmed, session is returned
      if (data.session) {
        toast.success('Registration successful!')
        router.refresh()
        router.push('/dashboard')
      } else {
        // If email confirmation is enabled, we show check inbox message
        toast.success('Registration initiated!')
        setIsPasswordSignedUp(true)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D2E] bg-radial-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-forest-green/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gold/10 blur-[80px]" />

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="flex justify-start">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-[#C5A059] transition-all">
            &larr; Back to Main Website
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block font-serif text-3xl font-black text-white tracking-wider">
            Sell Your Stamps <span className="text-[#C5A059]">UK</span>
          </Link>
          <h2 className="mt-6 text-center text-4xl font-serif font-bold text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Register to track quotes, submit collections, and manage payouts
          </p>
        </div>

        {isPasswordSignedUp ? (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            <h3 className="text-lg font-bold text-white font-serif">Confirm Your Email</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We've sent an email verification link to <strong className="text-white">{email}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Please click the link in your email to verify and activate your account. Once verified, you can sign in.
            </p>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#C5A059] hover:underline"
              >
                Go to Login <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />

            <form className="space-y-6" onSubmit={handlePasswordSignup}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="pwd-name" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      id="pwd-name"
                      name="name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
                      placeholder="John Doe"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pwd-email-address" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      id="pwd-email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
                      placeholder="you@example.com"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pwd-signup-password" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      id="pwd-signup-password"
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
                  <label htmlFor="pwd-signup-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                      id="pwd-signup-confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
                      placeholder="Re-enter password"
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
                      <Loader2 className="animate-spin h-5 w-5" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Register <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-sm text-slate-300">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-[#C5A059] hover:underline">
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
