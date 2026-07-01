'use client'

import React, { useState, useTransition, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`,
        },
      })

      if (error) {
        toast.error(error.message || 'Failed to send magic link/code')
        return
      }

      toast.success('Check your inbox for a login link or verification code!')
      setIsOtpSent(true)
      setCooldown(60)
    })
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpToken.length < 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpToken,
        type: 'email',
      })

      if (error) {
        toast.error(error.message || 'Verification failed. Please check the code or try again.')
        return
      }

      toast.success('Successfully logged in!')
      router.refresh()
      router.push(redirectedFrom)
    })
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) return

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`,
        },
      })

      if (error) {
        toast.error(error.message || 'Failed to resend code')
        return
      }

      toast.success('A new code has been sent to your email!')
      setCooldown(60)
      setOtpToken('')
    })
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Invalid email or password')
        return
      }

      toast.success('Successfully logged in!')
      router.refresh()
      router.push(redirectedFrom)
    })
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) {
        toast.error(error.message || 'Failed to send password reset email')
        return
      }

      toast.success('If an account exists, a password reset link has been sent!')
      setShowForgotPassword(false)
    })
  }

  if (isOtpSent) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
        
        <button
          type="button"
          onClick={() => {
            setIsOtpSent(false)
            setOtpToken('')
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-all bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" /> Change Email
        </button>

        <form className="space-y-6" onSubmit={handleVerifyOtp}>
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-white font-serif mb-1">Enter Verification Code</h3>
              <p className="text-xs text-slate-300">
                We've sent a 6-digit code to <strong className="text-white">{email}</strong>. Enter it below to sign in.
              </p>
            </div>

            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={otpToken}
                onChange={setOtpToken}
                containerClassName="text-white"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-11 h-12 text-lg font-bold border-white/10 bg-white/5 focus:ring-2 focus:ring-[#C5A059]" />
                  <InputOTPSlot index={1} className="w-11 h-12 text-lg font-bold border-white/10 bg-white/5 focus:ring-2 focus:ring-[#C5A059]" />
                  <InputOTPSlot index={2} className="w-11 h-12 text-lg font-bold border-white/10 bg-white/5 focus:ring-2 focus:ring-[#C5A059]" />
                  <InputOTPSlot index={3} className="w-11 h-12 text-lg font-bold border-white/10 bg-white/5 focus:ring-2 focus:ring-[#C5A059]" />
                  <InputOTPSlot index={4} className="w-11 h-12 text-lg font-bold border-white/10 bg-white/5 focus:ring-2 focus:ring-[#C5A059]" />
                  <InputOTPSlot index={5} className="w-11 h-12 text-lg font-bold border-white/10 bg-white/5 focus:ring-2 focus:ring-[#C5A059]" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isPending || otpToken.length < 6}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14452F] transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" /> Verifying...
                </>
              ) : (
                <>
                  Verify & Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isPending || cooldown > 0}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 bg-transparent transition-all disabled:opacity-50 cursor-pointer"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Verification Code'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-xs text-slate-400">
            Did not receive the code? Check your spam folder or try clicking the Magic Link in your email directly.
          </p>
        </div>
      </div>
    )
  }

  if (showForgotPassword) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
        
        <button
          type="button"
          onClick={() => setShowForgotPassword(false)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-all bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Login
        </button>

        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-serif mb-1">Reset Password</h3>
            <p className="text-xs text-slate-300">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div>
              <label htmlFor="forgot-email" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Email Address
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
                  placeholder="you@example.com"
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
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
      
      <Tabs defaultValue="magic-link" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
          <TabsTrigger value="magic-link" className="data-[state=active]:bg-[#14452F] data-[state=active]:text-white rounded-lg py-2 text-xs font-bold text-slate-300">
            Magic Link
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-[#14452F] data-[state=active]:text-white rounded-lg py-2 text-xs font-bold text-slate-300">
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="magic-link" className="space-y-6">
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label htmlFor="magic-email" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </span>
                <input
                  id="magic-email"
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
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14452F] transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Sending link...
                  </>
                ) : (
                  <>
                    Send Login Link & Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <form className="space-y-6" onSubmit={handlePasswordLogin}>
            <div>
              <label htmlFor="pwd-email" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Email Address
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
                  placeholder="you@example.com"
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
                    <Loader2 className="animate-spin h-5 w-5" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center border-t border-white/10 pt-6">
        <p className="text-sm text-slate-300">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-[#C5A059] hover:underline">
            Register Here
          </Link>
        </p>
      </div>
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
