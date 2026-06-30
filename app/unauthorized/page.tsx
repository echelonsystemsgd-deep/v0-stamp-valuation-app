'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/auth/actions'
import { ShieldAlert, ArrowLeft, LogOut, Loader2 } from 'lucide-react'

export default function UnauthorizedPage() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D2E] bg-radial-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-red-950/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gold/10 blur-[80px]" />

      <div className="max-w-md w-full space-y-8 z-10 text-center">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Red Border Line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 to-[#C5A059]" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <ShieldAlert className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-slate-300 mb-8 leading-relaxed">
            You do not have the required administrative permissions to access the Admin Console. Please return to your seller console or sign in with an authorized administrator account.
          </p>

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 transition-all cursor-pointer shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" /> Go to Seller Console
            </Link>

            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Signing out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" /> Sign Out & Go to Login
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <Link href="/" className="inline-block font-serif text-2xl font-black text-white tracking-wider opacity-80 hover:opacity-100 transition-opacity">
            Sell Your Stamps <span className="text-[#C5A059]">UK</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
