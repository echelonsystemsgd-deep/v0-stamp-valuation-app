'use client'

import React, { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  const supabase = createClient()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    startTransition(async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast.error(error.message || 'Invalid email or password')
          return
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

          if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
            await supabase.auth.signOut()
            toast.error('Access restricted to internal staff personnel.')
            return
          }

          toast.success('Successfully logged in!')
          router.refresh()
          if (profile.role === 'staff') {
            router.push('/worker')
          } else {
            router.push('/admin')
          }
        }
      } catch (err: any) {
        console.error('Login error:', err)
        toast.error('Connection Error: Unable to reach authentication server. Please check your network connection or verify your Supabase configuration.')
      }
    })
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
          toast.error(error.message || 'Failed to send password reset email')
          return
        }

        toast.success('If a staff account exists, a password reset link has been sent!')
        setShowForgotPassword(false)
      } catch (err: any) {
        console.error('Reset password error:', err)
        toast.error('Connection Error: Unable to reach authentication server. Please check your network connection.')
      }
    })
  }

  if (showForgotPassword) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
        
        <button
          type="button"
          onClick={() => setShowForgotPassword(false)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-all bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Staff Login
        </button>

        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-serif mb-1">Reset Staff Password</h3>
            <p className="text-xs text-slate-300">
              Enter your staff email address to receive password reset instructions.
            </p>
            
            <div>
              <label htmlFor="forgot-email" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Staff Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </span>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
                  placeholder="staff@ukstampvaluations.co.uk"
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
                  <Loader2 className="animate-spin h-5 w-5" /> Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
      
      <form className="space-y-6" onSubmit={handlePasswordLogin}>
        <div>
          <label htmlFor="pwd-email" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            Staff Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </span>
            <input
              id="pwd-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
              placeholder="staff@ukstampvaluations.co.uk"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="pwd-password" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs font-semibold text-[#C5A059] hover:underline bg-transparent border-0 cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </span>
            <input
              id="pwd-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent text-sm transition-all"
              placeholder="••••••••"
              disabled={isPending}
            />
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
                <Loader2 className="animate-spin h-5 w-5" /> Authenticating...
              </>
            ) : (
              <>
                Staff Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function LoginPage() {
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
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Access your secure portal to track valuations and payouts
          </p>
        </div>

        <Suspense
          fallback={
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="animate-spin h-8 w-8 text-[#C5A059]" />
              <p className="text-sm text-slate-300 mt-4">Loading login portal...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
