'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  MapPin, 
  FileText, 
  Check, 
  AlertTriangle,
  User,
  Package,
  Truck,
  Download,
  AlertCircle,
  HelpCircle,
  Printer
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SubmissionItem {
  id: string
  submission_id: string
  category_id: string | null
  quantity: number
  rate_at_submission: number
  face_value_at_submission: number
  calculated_value: number
  reviewed_quantity: number | null
  reviewed_value: number | null
  stamp_categories: {
    name: string
    group_name: string
  } | null
}

interface SubmissionImage {
  id: string
  image_url: string
  file_path: string
}

interface Message {
  id: string
  submission_id: string
  sender_id: string | null
  message: string
  is_read_by_admin: boolean
  is_read_by_seller: boolean
  created_at: string
  profiles: {
    full_name: string | null
    email: string
    role: 'user' | 'seller' | 'admin'
  } | null
}

interface Submission {
  id: string
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  guest_postcode: string | null
  collection_type: string
  approx_quantity: string
  estimated_era: string
  description: string
  valuable_items: string | null
  estimated_valuation: number
  final_reviewed_valuation: number | null
  status: 
    | 'quote_requested' 
    | 'quote_given' 
    | 'awaiting_shipment' 
    | 'in_transit' 
    | 'received' 
    | 'under_review' 
    | 'approved' 
    | 'paid' 
    | 'rejected' 
    | 'cancelled'
  tracking_reference: string | null
  rejection_reason: string | null
  cancellation_reason: string | null
  date_received: string | null
  created_at: string
  updated_at: string
}

interface SubmissionDetailClientProps {
  initialSubmission: Submission
  initialItems: SubmissionItem[]
  initialImages: SubmissionImage[]
  initialMessages: Message[]
  userId: string
  userEmail: string
}

// Progressive stepper sequence
const STEPPER_STATES: Submission['status'][] = [
  'quote_requested',
  'quote_given',
  'awaiting_shipment',
  'in_transit',
  'received',
  'under_review',
  'approved',
  'paid'
]

const STATE_LABELS: Record<Submission['status'], string> = {
  quote_requested: 'Quote Requested',
  quote_given: 'Quote Issued',
  awaiting_shipment: 'Awaiting Shipment',
  in_transit: 'In Transit',
  received: 'Received',
  under_review: 'Under Review',
  approved: 'Approved',
  paid: 'Payout Paid',
  rejected: 'Rejected',
  cancelled: 'Cancelled'
}

export function SubmissionDetailClient({
  initialSubmission,
  initialItems,
  initialImages,
  initialMessages,
  userId,
  userEmail
}: SubmissionDetailClientProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [submission, setSubmission] = useState<Submission>(initialSubmission)
  const [items] = useState<SubmissionItem[]>(initialItems)
  const [images] = useState<SubmissionImage[]>(initialImages)
  
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessageText, setNewMessageText] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  
  const [acceptingQuote, setAcceptingQuote] = useState(false)
  const [updatingTracking, setUpdatingTracking] = useState(false)
  const [carrier, setCarrier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription for submissions status & chat messages
  useEffect(() => {
    // 1. Subscribe to Submission table updates
    const subChannel = supabase
      .channel(`submission-detail-${submission.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'submissions',
          filter: `id=eq.${submission.id}`
        },
        (payload) => {
          setSubmission(payload.new as Submission)
          toast.info(`Appraisal status updated: ${STATE_LABELS[payload.new.status as Submission['status']]}`)
        }
      )
      .subscribe()

    // 2. Subscribe to Messages updates
    const msgChannel = supabase
      .channel(`submission-messages-${submission.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submission_messages',
          filter: `submission_id=eq.${submission.id}`
        },
        async (payload) => {
          const newMsg = payload.new as Message
          // Fetch sender profile details to display name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, role')
            .eq('id', newMsg.sender_id || '')
            .single()

          const populatedMsg: Message = {
            ...newMsg,
            profiles: profile || null
          }

          setMessages((prev) => [...prev, populatedMsg])
        }
      )
      .subscribe()

    // 3. Mark messages as read by seller when loading/updating
    const markAsRead = async () => {
      await supabase
        .from('submission_messages')
        .update({ is_read_by_seller: true })
        .eq('submission_id', submission.id)
        .eq('is_read_by_seller', false)
    }
    markAsRead()

    return () => {
      supabase.removeChannel(subChannel)
      supabase.removeChannel(msgChannel)
    }
  }, [submission.id, supabase])

  // SLA contextual notices
  const getContextualSLA = (status: Submission['status']) => {
    switch (status) {
      case 'quote_requested':
        return 'Our stamp evaluation experts are reviewing your submission details. Estimated quotes are typically issued within 24 business hours.'
      case 'quote_given':
        return 'We have issued an administrative buying estimate. Review and accept the estimate below to obtain shipping instructions.'
      case 'awaiting_shipment':
        return 'Please securely package your collection and drop it off at your local carrier. Provide the tracking reference below once shipped.'
      case 'in_transit':
        return 'Your package is currently in transit to our verification hub. We will update you immediately upon receipt.'
      case 'received':
        return 'We have successfully received your package! It is currently queued for physical appraisal.'
      case 'under_review':
        return 'Our experts are conducting a physical inspection and counting of your stamps. Auditing normally completes within 2-3 business days.'
      case 'approved':
        return 'The physical valuation has been completed and approved. Payments are queued and disbursed to your registered bank account.'
      case 'paid':
        return 'This appraisal has been fully settled. You can review payment reference details and download the summary receipt.'
      default:
        return null
    }
  }

  // Carrier tracking link generator
  const getTrackingUrl = (trackingRef: string) => {
    const ref = trackingRef.trim()
    const lower = ref.toLowerCase()
    
    if (lower.startsWith('gb') || lower.startsWith('rq') || ref.length === 13) {
      // standard Royal Mail pattern
      return `https://www.royalmail.com/track-your-item#/tracking-results/${ref}`
    }
    if (ref.length === 10 && !isNaN(Number(ref))) {
      // DHL Express often 10 digits
      return `https://www.dhl.com/en/express/tracking.html?AWB=${ref}`
    }
    return `https://www.royalmail.com/track-your-item#/tracking-results/${ref}` // fallback to Royal Mail
  }

  // Accept quote handler
  const handleAcceptQuote = async () => {
    const confirm = window.confirm('Are you sure you want to accept this valuation estimate and proceed to shipment?')
    if (!confirm) return

    setAcceptingQuote(true)
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status: 'awaiting_shipment',
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id)

      if (error) throw error
      toast.success('Valuation estimate accepted! Shipping instructions unlocked.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept estimate')
    } finally {
      setAcceptingQuote(false)
    }
  }

  // Submit tracking details handler
  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carrier.trim() || !trackingNumber.trim()) {
      toast.error('Please fill in both Carrier Name and Tracking Reference')
      return
    }

    setUpdatingTracking(true)
    try {
      const formattedTracking = `${carrier.trim()}: ${trackingNumber.trim()}`
      const { error } = await supabase
        .from('submissions')
        .update({
          status: 'in_transit',
          tracking_reference: formattedTracking,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id)

      if (error) throw error
      toast.success('Tracking details logged! Status updated to In Transit.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tracking details')
    } finally {
      setUpdatingTracking(false)
    }
  }

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessageText.trim()) return

    setSendingMsg(true)
    try {
      const { error } = await supabase
        .from('submission_messages')
        .insert({
          submission_id: submission.id,
          sender_id: userId,
          message: newMessageText.trim(),
          is_read_by_admin: false,
          is_read_by_seller: true // sender has read it
        })

      if (error) throw error
      setNewMessageText('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message')
    } finally {
      setSendingMsg(false)
    }
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  const activeIndex = STEPPER_STATES.indexOf(submission.status)
  const isTerminated = submission.status === 'rejected' || submission.status === 'cancelled'

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400">VALUATION RECORD</span>
            <h1 className="font-serif text-2xl font-bold text-[#0B1D2E] flex items-center gap-2">
              VAL-{submission.id.slice(0, 8).toUpperCase()}
            </h1>
          </div>
        </div>

        {/* 1. Stepper / End-state status banner */}
        {isTerminated ? (
          /* High-contrast status banner for cancelled/rejected */
          <div className={cn(
            "p-6 rounded-2xl border flex items-start gap-4 shadow-sm",
            submission.status === 'rejected' 
              ? "bg-red-50/50 border-red-200 text-red-800" 
              : "bg-slate-50 border-slate-200 text-slate-700"
          )}>
            <AlertTriangle className="h-6 w-6 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold">
                Appraisal {submission.status === 'rejected' ? 'Rejected' : 'Cancelled'}
              </h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {submission.status === 'rejected' 
                  ? `This appraisal request was declined: "${submission.rejection_reason || 'No reason specified'}"`
                  : `This appraisal request was cancelled: "${submission.cancellation_reason || 'No reason specified'}"`
                }
              </p>
              <p className="text-xs mt-2 opacity-80">
                If you have any questions or would like to submit another collection, please message us using the conversation thread on the right or contact support.
              </p>
            </div>
          </div>
        ) : (
          /* Progressive Stepper Timeline */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Timeline Stepper</h3>
            
            {/* Desktop Stepper */}
            <div className="hidden lg:flex items-center justify-between relative w-full pt-4 pb-8">
              {/* Stepper Progress Bar Background */}
              <div className="absolute top-[28px] left-[5%] right-[5%] h-1 bg-slate-100 -z-10" />
              <div 
                className="absolute top-[28px] left-[5%] h-1 bg-[#14452F] -z-10 transition-all duration-500" 
                style={{ width: `${(activeIndex / (STEPPER_STATES.length - 1)) * 90}%` }}
              />

              {STEPPER_STATES.map((state, index) => {
                const isCompleted = index < activeIndex
                const isActive = index === activeIndex
                
                return (
                  <div key={state} className="flex flex-col items-center text-center w-[12%] space-y-2 relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-[#14452F] border-[#14452F] text-white",
                      isActive && "bg-white border-[#C5A059] shadow-lg ring-4 ring-[#C5A059]/10 text-[#C5A059]",
                      !isCompleted && !isActive && "bg-white border-slate-200 text-slate-350"
                    )}>
                      {isCompleted ? (
                        <Check className="h-4 w-4 stroke-[3px]" />
                      ) : (
                        <span className="text-xs font-black">{index + 1}</span>
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider block leading-tight max-w-[90px] mx-auto",
                      isActive ? "text-[#C5A059] font-black" : (isCompleted ? "text-[#14452F]" : "text-slate-400")
                    )}>
                      {STATE_LABELS[state]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Mobile/Tablet Stepper (Vertical) */}
            <div className="lg:hidden space-y-4 pt-2">
              {STEPPER_STATES.map((state, index) => {
                const isCompleted = index < activeIndex
                const isActive = index === activeIndex
                
                if (!isCompleted && !isActive && index > activeIndex + 1) return null // collapse pending steps
                
                return (
                  <div key={state} className="flex gap-3.5 items-start">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0",
                        isCompleted && "bg-[#14452F] border-[#14452F] text-white",
                        isActive && "bg-white border-[#C5A059] ring-2 ring-[#C5A059]/10 text-[#C5A059]",
                        !isCompleted && !isActive && "bg-white border-slate-200 text-slate-400"
                      )}>
                        {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3px]" /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </div>
                      {index < STEPPER_STATES.length - 1 && (
                        <div className={cn("w-[2px] h-8 my-1 bg-slate-100", isCompleted && "bg-[#14452F]")} />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <span className={cn(
                        "text-xs font-black uppercase tracking-wider block",
                        isActive ? "text-[#C5A059]" : (isCompleted ? "text-[#14452F]" : "text-slate-400")
                      )}>
                        {STATE_LABELS[state]} {isActive && "(Current)"}
                      </span>
                      {isActive && (
                        <p className="text-xs text-slate-500 mt-1">{getContextualSLA(state)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop SLA Contextual Box */}
            <div className="hidden lg:flex items-start gap-3 bg-[#0B1D2E]/5 p-4 rounded-xl text-[#0B1D2E]/80 text-xs border border-[#0B1D2E]/10">
              <Clock className="h-4 w-4 shrink-0 mt-0.5 text-[#C5A059]" />
              <div>
                <strong>Current State SLA:</strong> {getContextualSLA(submission.status)}
              </div>
            </div>
          </div>
        )}

        {/* Columns Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Appraisal Details & Audit Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 2. Details Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#0B1D2E] border-b border-slate-100 pb-3">
                Submission Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Collection Type</span>
                  <span className="font-bold text-[#0B1D2E] capitalize">{submission.collection_type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Approx. Quantity</span>
                  <span className="font-bold text-[#0B1D2E]">{submission.approx_quantity} stamps</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Estimated Era</span>
                  <span className="font-bold text-[#0B1D2E]">{submission.estimated_era}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Estimated Valuation</span>
                  <span className="font-serif font-black text-[#14452F]">
                    {formatGBP(submission.final_reviewed_valuation ?? submission.estimated_valuation)}
                  </span>
                </div>
                {submission.tracking_reference && (
                  <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Courier / Tracking ID</span>
                      <span className="font-bold text-slate-700">{submission.tracking_reference}</span>
                    </div>
                    {(() => {
                      const parts = submission.tracking_reference.split(':')
                      const ref = parts.length > 1 ? parts[1].trim() : parts[0].trim()
                      return (
                        <a
                          href={getTrackingUrl(ref)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#14452F] hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Track Package <Truck className="h-3.5 w-3.5" />
                        </a>
                      )
                    })()}
                  </div>
                )}
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Seller Notes & Description</span>
                  <p className="text-slate-650 leading-relaxed mt-1 whitespace-pre-wrap">{submission.description}</p>
                </div>
                {submission.valuable_items && (
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Notable Valuable Items</span>
                    <p className="text-slate-650 leading-relaxed mt-1 whitespace-pre-wrap">{submission.valuable_items}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Conditional Action Cards */}
            
            {/* Status: quote_given */}
            {submission.status === 'quote_given' && (
              <div className="bg-white rounded-3xl border border-yellow-200 bg-yellow-50/20 shadow-md p-6 sm:p-8 space-y-4">
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Buying Estimate Received</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      We have issued an initial valuation estimate of <strong>{formatGBP(submission.estimated_valuation)}</strong>. To accept this quote and proceed with mailing your stamps for verified auditing, click the accept button.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleAcceptQuote}
                    disabled={acceptingQuote}
                    className="bg-[#14452F] hover:bg-[#14452F]/90 text-white font-bold h-11 px-8 rounded-xl shadow-md cursor-pointer"
                  >
                    {acceptingQuote ? 'Accepting Estimate...' : 'Accept Buy Quote'}
                  </Button>
                </div>
              </div>
            )}

            {/* Status: awaiting_shipment */}
            {submission.status === 'awaiting_shipment' && (
              <div className="bg-white rounded-3xl border border-[#C5A059]/30 shadow-md p-6 sm:p-8 space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E] flex items-center gap-2">
                  <Package className="h-6 w-6 text-[#C5A059]" />
                  Shipping Instructions & Address
                </h3>
                
                <div className="text-sm text-slate-600 space-y-4 leading-relaxed bg-[#FBFBF9] p-5 rounded-2xl border border-slate-100">
                  <p><strong>1. Pack Securely:</strong> Put your stamps in a waterproof bag inside a padded envelope or box to prevent damage in transit.</p>
                  <p><strong>2. Include Reference:</strong> Write the Valuation ID <strong>VAL-{submission.id.slice(0,8).toUpperCase()}</strong> clearly on the package or enclose a printed copy of this page.</p>
                  <p><strong>3. Ship to Our Hub:</strong> Ship using a tracked service (e.g. Royal Mail Signed For) to the following address:</p>
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-[#0B1D2E] max-w-sm flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      Stamp Appraisal Department<br />
                      Sell Your Stamps UK HQ<br />
                      14 Heritage Lane, London<br />
                      EC1A 1BB, United Kingdom
                    </div>
                  </div>
                </div>

                {/* Print Packing Slip Button */}
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">Need a packing slip?</p>
                    <p className="text-[11px] text-slate-500">Print and include this document inside your parcel so we can identify your stamps instantly.</p>
                  </div>
                  <a
                    href={`/dashboard/submissions/${submission.id}/print`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white text-xs font-bold text-[#0B1D2E] rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Printer className="h-4 w-4 text-[#C5A059]" /> Print Packing Slip
                  </a>
                </div>

                <form onSubmit={handleTrackingSubmit} className="space-y-4 pt-2">
                  <h4 className="font-bold text-sm text-[#0B1D2E]">Log Shipping Tracking Reference</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="carrier" className="text-xs font-bold text-slate-500 uppercase">Carrier Name</Label>
                      <Input
                        id="carrier"
                        type="text"
                        placeholder="e.g. Royal Mail, DPD"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        className="h-10 border-slate-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trackingRef" className="text-xs font-bold text-slate-500 uppercase">Tracking Number</Label>
                      <Input
                        id="trackingRef"
                        type="text"
                        placeholder="e.g. JB123456789GB"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="h-10 border-slate-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={updatingTracking}
                      className="bg-[#14452F] hover:bg-[#14452F]/90 text-white font-bold h-11 px-6 rounded-xl shadow-md cursor-pointer"
                    >
                      {updatingTracking ? 'Saving tracking...' : 'Submit Tracking Info'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Status: approved / paid (Print Receipt CTA) */}
            {(submission.status === 'approved' || submission.status === 'paid') && (
              <div className="bg-[#14452F]/5 border border-[#14452F]/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Appraisal Settlement Invoice</h3>
                  <p className="text-xs text-slate-500">
                    A summary of the verified items, buying rates, and payout confirmations is ready.
                  </p>
                </div>
                <Link
                  href={`/dashboard/submissions/${submission.id}/receipt`}
                  target="_blank"
                  className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 transition-all shadow-md cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download Receipt PDF
                </Link>
              </div>
            )}

            {/* 4. Audited Comparison Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">Itemized Stamp Breakdown</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                  {items.length} Category Rows
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                      <th className="pb-3">Stamp Category</th>
                      <th className="pb-3 text-center">Buy Rate</th>
                      <th className="pb-3 text-center">Submitted Qty</th>
                      {/* Audited header columns */}
                      {(submission.status === 'approved' || submission.status === 'paid' || submission.status === 'under_review') && (
                        <>
                          <th className="pb-3 text-center text-[#C5A059]">Audited Qty</th>
                          <th className="pb-3 text-right text-[#14452F]">Audited Subtotal</th>
                        </>
                      )}
                      <th className="pb-3 text-right">Est. Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {items.map((item) => {
                      const isAuditedDiff = 
                        item.reviewed_quantity !== null && 
                        item.reviewed_quantity !== item.quantity

                      const showAudit = 
                        submission.status === 'approved' || 
                        submission.status === 'paid' || 
                        submission.status === 'under_review'

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5">
                            <span className="font-bold text-[#0B1D2E] block">
                              {item.stamp_categories?.name || 'Unknown Category'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                              {item.stamp_categories?.group_name || 'General'}
                            </span>
                          </td>
                          <td className="py-3.5 text-center font-mono font-medium text-slate-500">
                            {(item.rate_at_submission * 100).toFixed(0)}%
                          </td>
                          <td className={cn(
                            "py-3.5 text-center font-semibold font-mono",
                            showAudit && isAuditedDiff ? "text-slate-400 line-through" : "text-slate-700"
                          )}>
                            {Number(item.quantity).toLocaleString()}
                          </td>
                          
                          {/* Audited Data */}
                          {showAudit && (
                            <>
                              <td className={cn(
                                "py-3.5 text-center font-bold font-mono text-xs",
                                isAuditedDiff 
                                  ? "text-emerald-700 bg-emerald-50 rounded-lg px-2 font-black border border-emerald-100" 
                                  : "text-slate-700"
                              )}>
                                {item.reviewed_quantity !== null 
                                  ? Number(item.reviewed_quantity).toLocaleString() 
                                  : 'Pending'}
                              </td>
                              <td className="py-3.5 text-right font-bold text-[#14452F] font-serif">
                                {item.reviewed_value !== null 
                                  ? formatGBP(Number(item.reviewed_value)) 
                                  : 'Pending'}
                              </td>
                            </>
                          )}
                          <td className="py-3.5 text-right font-semibold text-slate-700 font-serif">
                            {formatGBP(Number(item.calculated_value))}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Chat Widget & Photo Preview */}
          <div className="space-y-8">
            
            {/* 5. Realtime Conversation Board */}
            <div className="bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl overflow-hidden flex flex-col h-[520px]">
              {/* Chat Header */}
              <div className="p-5 border-b border-[#C5A059]/10 bg-black/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#C5A059]">Valuation Help Board</h3>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mt-0.5">
                    Private Admin Thread
                  </span>
                </div>
                <div className="p-2 bg-[#14452F]/30 border border-[#14452F]/40 text-emerald-400 rounded-lg text-xs font-bold animate-pulse">
                  Live
                </div>
              </div>

              {/* Chat Feed Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-[#081523]/30">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-3">
                    <HelpCircle className="h-8 w-8 text-[#C5A059] opacity-40" />
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                      Have questions about your estimate, physical stamp conditions, or payouts? Send a message to our admin team.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.profiles?.role === 'admin'
                    const senderName = msg.profiles?.full_name || (isAdmin ? 'Admin Agent' : 'Seller')
                    
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs relative shadow-sm",
                          isAdmin
                            ? "bg-[#0B1D2E] text-slate-200 border border-[#C5A059]/20 self-start rounded-tl-none"
                            : "bg-[#14452F] text-white self-end rounded-tr-none"
                        )}
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400 mb-1">
                          {senderName} • {new Date(msg.created_at).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Send Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#C5A059]/10 bg-black/10 shrink-0 flex gap-2">
                <textarea
                  placeholder="Ask a question or reply..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                  className="flex-1 h-11 bg-white/5 border border-[#C5A059]/15 text-slate-200 placeholder-slate-500 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-[#C5A059]/50 resize-none custom-scrollbar"
                  disabled={sendingMsg}
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !newMessageText.trim()}
                  className="p-3 bg-[#14452F] hover:bg-[#14452F]/90 text-white border border-[#14452F]/20 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* 6. Photo uploads sidebar preview */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h4 className="font-serif text-md font-bold text-[#0B1D2E]">Uploaded Collection Photos</h4>
              {images.length === 0 ? (
                <p className="text-xs text-slate-400">No images uploaded for this appraisal.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3.5">
                  {images.map((img) => (
                    <a
                      key={img.id}
                      href={img.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:scale-105 transition-transform duration-200 group block cursor-zoom-in"
                    >
                      <img
                        src={img.image_url}
                        alt="Collection upload"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold flex items-center gap-0.5">
                          View <FileText className="h-3 w-3" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
