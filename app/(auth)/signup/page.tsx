'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, User, Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isPasswordSignedUp, setIsPasswordSignedUp] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isPending, startTransition] = useTransition()
  
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

  const handleMagicSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email) {
      toast.error('Please fill in all fields')
      return
    }

    startTransition(async () => {
      // Pass full_name inside options.data so that handle_new_user() trigger function
      // can read it from raw_user_meta_data->>'full_name'.
      const { error } = await supabase.auth.signInWithOtp({
        email,
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

      toast.success('Check your inbox for a registration link or verification code!')
      setIsOtpSent(true)
      setCooldown(60)
    })
  }

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

      toast.success('Registration successful!')
      router.refresh()
      router.push('/dashboard')
    })
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) return

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        toast.error(error.message || 'Failed to resend code')
        return
      }

      toast.success('A new registration code has been sent!')
      setCooldown(60)
      setOtpToken('')
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

        {isOtpSent ? (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            
            <button
              onClick={() => {
                setIsOtpSent(false)
                setOtpToken('')
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-all bg-transparent border-0 cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Signup
            </button>

            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="space-y-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white font-serif mb-1">Verify Your Registration</h3>
                  <p className="text-xs text-slate-300">
                    We've sent a 6-digit code to <strong className="text-white">{email}</strong>. Enter it below to complete your registration.
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
                      Complete Registration <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isPending || cooldown > 0}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 bg-transparent transition-all disabled:opacity-50 cursor-pointer"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Registration Code'}
                </button>
              </div>
            </form>
          </div>
        ) : isPasswordSignedUp ? (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden text-center space-y-4">
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
                <form className="space-y-6" onSubmit={handleMagicSignup}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="magic-name" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                          id="magic-name"
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
                      <label htmlFor="magic-email-address" className="block text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                          id="magic-email-address"
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
              </TabsContent>

              <TabsContent value="password" className="space-y-6">
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
              </TabsContent>
            </Tabs>

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
