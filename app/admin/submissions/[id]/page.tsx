'use client'

import React, { useEffect, useState, useRef, useTransition } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  MapPin, 
  FileText, 
  Check, 
  X, 
  Loader2, 
  Download, 
  AlertCircle,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  User,
  Shield,
  CreditCard,
  MessageSquare,
  ClipboardList,
  Printer,
  Copy,
  ExternalLink,
  Mail,
  Phone,
  Package
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { 
  parseSubmissionMetadata, 
  getSellingOptionBadge, 
  getPreferredContactBadge, 
  getShippingPreferenceBadge 
} from '@/lib/submissions'

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
    role: 'user' | 'seller' | 'admin' | 'staff'
  } | null
}

interface InternalNote {
  id: string
  note: string
  created_at: string
  profiles: {
    full_name: string | null
    email: string
  } | null
}

interface SubmissionHistory {
  id: string
  old_status: string
  new_status: string
  notes: string | null
  created_at: string
  profiles: {
    full_name: string | null
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
  applied_bonus_code_id: string | null
  payout_bonus_codes: {
    code: string
    percentage_bonus: number
  } | null
  assigned_appraiser_id: string | null
  assigned_profile: {
    full_name: string | null
  } | null
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  postcode: string | null
  role: 'user' | 'seller' | 'admin' | 'staff'
  status: 'active' | 'restricted' | 'banned'
  payout_details: {
    payout_method?: string
    bank_name?: string
    payee_name?: string
    account_number?: string
    sort_code?: string
    cheque_recipient?: string
    cheque_address?: string
  }
}

const statusConfig: Record<Submission['status'], { label: string; className: string }> = {
  quote_requested: { label: 'Quote Requested', className: 'bg-amber-50 text-amber-700 border-amber-250/20' },
  quote_given: { label: 'Quote Given', className: 'bg-yellow-50 text-yellow-800 border-yellow-250/20' },
  awaiting_shipment: { label: 'Awaiting Shipment', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_transit: { label: 'In Transit', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  received: { label: 'Received', className: 'bg-indigo-50 text-indigo-750 border-indigo-200' },
  under_review: { label: 'Under Review', className: 'bg-amber-50 text-[#C5A059] border-[#C5A059]/25' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-[#14452F] border-[#14452F]/25' },
  paid: { label: 'Paid & Disbursed', className: 'bg-emerald-100 text-emerald-800 border-emerald-350/20' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-650 border-slate-200' },
}

export default function SubmissionWorkspace() {
  const supabase = createClient()
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [items, setItems] = useState<SubmissionItem[]>([])
  const [images, setImages] = useState<SubmissionImage[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [notes, setNotes] = useState<InternalNote[]>([])
  const [history, setHistory] = useState<SubmissionHistory[]>([])
  const [sellerProfile, setSellerProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // UI Interactive States
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)
  const [rotateDeg, setRotateDeg] = useState(0)
  
  // Audit Quantities edits
  const [auditedQuantities, setAuditedQuantities] = useState<Record<string, number>>({})
  
  // Modals & Forms
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'cheque'>('bank_transfer')
  const [payoutReference, setPayoutReference] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  
  const [chatMessage, setChatMessage] = useState('')
  const [staffNote, setStaffNote] = useState('')
  const [currentAdminUser, setCurrentAdminUser] = useState<{ id: string; role: string } | null>(null)
  
  const [splitWidth, setSplitWidth] = useState(65)
  const [isResizing, setIsResizing] = useState(false)
  const [showCannedDropdown, setShowCannedDropdown] = useState(false)
  const [activeBonusCodes, setActiveBonusCodes] = useState<{ id: string; code: string; percentage_bonus: number }[]>([])
  const [showPrintModal, setShowPrintModal] = useState(false)

  const handleCopyQuoteEmail = () => {
    if (!submission) return
    const customerName = sellerProfile?.full_name || submission.guest_name || 'Valued Customer'
    const text = `Dear ${customerName},\n\nThank you for submitting your ${submission.collection_type.replace(/_/g, ' ')} collection for valuation.\n\nValuation Ref: VAL-${submission.id.slice(0, 8).toUpperCase()}\nCollection Era: ${submission.estimated_era}\nCalculated Payout Offer: ${formatGBP(finalPayoutTotal)}\n\nIf you accept this valuation offer, please confirm by replying to this email or logging into your seller portal.\n\nBest regards,\nUK Stamp Valuations Desk`
    navigator.clipboard.writeText(text)
    toast.success('Copied Valuation Quote email text to clipboard!')
  }

  const handleCopyShippingAdvice = () => {
    if (!submission) return
    const text = `Shipping Instructions for Valuation VAL-${submission.id.slice(0, 8).toUpperCase()}:\n\n1. Package your stamp collection securely using padded envelopes or cardboard boxes.\n2. Include a slip with your Valuation Reference (VAL-${submission.id.slice(0, 8).toUpperCase()}) inside the parcel.\n3. Send via Royal Mail Signed For or Special Delivery to ensure tracking.\n\nReturn Address:\nUK Stamp Valuations Processing Desk\nAttn: Valuation Team\nUnited Kingdom`
    navigator.clipboard.writeText(text)
    toast.success('Copied Shipping Instructions to clipboard!')
  }

  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [appraisers, setAppraisers] = useState<any[]>([])

  useEffect(() => {
    const fetchAppraisers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['admin', 'staff'])
        .order('full_name', { ascending: true })
      setAppraisers(data || [])
    }
    if (currentAdminUser?.role === 'admin') {
      fetchAppraisers()
    }
  }, [currentAdminUser])

  // Fetch initial details
  const fetchAllData = async () => {
    try {
      // Get current admin auth session
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setCurrentAdminUser({ id: user.id, role: prof?.role || 'staff' })
      }

      // Fetch Submissions with joined payout_bonus_codes
      const { data: sub, error: subErr } = await supabase
        .from('submissions')
        .select('*, payout_bonus_codes(code, percentage_bonus), assigned_profile:profiles!assigned_appraiser_id(full_name)')
        .eq('id', id)
        .single()

      if (subErr) throw subErr
      setSubmission(sub)

      // Fetch active bonus codes
      const { data: bonusCodes } = await supabase
        .from('payout_bonus_codes')
        .select('id, code, percentage_bonus')
        .eq('is_active', true)

      setActiveBonusCodes(bonusCodes || [])

      // Fetch Items
      const { data: itms, error: itmsErr } = await supabase
        .from('submission_items')
        .select('*, stamp_categories(name, group_name)')
        .eq('submission_id', id)

      if (itmsErr) throw itmsErr
      setItems(itms || [])

      // Map initial audited quantities
      const quantitiesMap: Record<string, number> = {}
      itms?.forEach((item: any) => {
        quantitiesMap[item.id] = item.reviewed_quantity !== null ? item.reviewed_quantity : item.quantity
      })
      setAuditedQuantities(quantitiesMap)

      // Fetch Images
      const { data: imgs, error: imgsErr } = await supabase
        .from('submission_images')
        .select('*')
        .eq('submission_id', id)

      if (imgsErr) throw imgsErr
      setImages(imgs || [])

      // Fetch Messages (Chat)
      const { data: msgs, error: msgsErr } = await supabase
        .from('submission_messages')
        .select('*, profiles(full_name, email, role)')
        .eq('submission_id', id)
        .order('created_at', { ascending: true })

      if (msgsErr) throw msgsErr
      setMessages(msgs || [])

      // Mark incoming messages as read by admin
      await supabase
        .from('submission_messages')
        .update({ is_read_by_admin: true })
        .eq('submission_id', id)
        .eq('is_read_by_admin', false)

      // Fetch Private Staff Notes
      const { data: nts, error: ntsErr } = await supabase
        .from('submission_internal_notes')
        .select('*, profiles(full_name, email)')
        .eq('submission_id', id)
        .order('created_at', { ascending: true })

      if (ntsErr) throw ntsErr
      setNotes(nts || [])

      // Fetch History Timelines
      const { data: hist, error: histErr } = await supabase
        .from('submission_history')
        .select('*, profiles:changed_by(full_name)')
        .eq('submission_id', id)
        .order('created_at', { ascending: false })

      if (histErr) throw histErr
      setHistory(hist || [])

      // Fetch Seller profile if submission is linked
      if (sub.user_id) {
        const { data: seller, error: sellerErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sub.user_id)
          .single()

        if (!sellerErr && seller) {
          const { data: payDetails } = await supabase
            .from('profile_payout_details')
            .select('*')
            .eq('id', sub.user_id)
            .single()

          setSellerProfile({
            ...seller,
            payout_details: payDetails ? {
              payout_method: payDetails.payout_method,
              bank_name: payDetails.bank_name || undefined,
              payee_name: payDetails.bank_account_name || undefined,
              account_number: payDetails.bank_account_number || undefined,
              sort_code: payDetails.bank_sort_code || undefined,
              cheque_recipient: payDetails.cheque_recipient_name || undefined,
              cheque_address: `${payDetails.cheque_address_line1 || ''} ${payDetails.cheque_address_line2 || ''} ${payDetails.cheque_city || ''} ${payDetails.cheque_postcode || ''}`.trim() || undefined
            } : {}
          })
        }
      }

    } catch (err: any) {
      toast.error('Failed to load appraisal details: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    fetchAllData()

    // Realtime subscribers
    const mountId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const messagesSubscription = supabase
      .channel(`appraisal-messages-${id}-${mountId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submission_messages', filter: `submission_id=eq.${id}` },
        async (payload: any) => {
          // Refetch messages to get full profile join
          const { data: newMsg } = await supabase
            .from('submission_messages')
            .select('*, profiles(full_name, email, role)')
            .eq('id', payload.new.id)
            .single()

          if (!isMounted) return

          if (newMsg) {
            setMessages(prev => [...prev, newMsg])
            // Auto mark read
            await supabase
              .from('submission_messages')
              .update({ is_read_by_admin: true })
              .eq('id', payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(messagesSubscription)
    }
  }, [id])

  // Scroll to bottom of chat feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Drag resizer mouse listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const container = document.getElementById('appraisal-split-container')
      if (!container) return
      
      const containerRect = container.getBoundingClientRect()
      // Adjust splitWidth based on mouse X coordinate relative to container
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      
      // Restrict left panel to be between 40% and 80%
      if (newWidth >= 40 && newWidth <= 80) {
        setSplitWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  // Audited qty changes (reactive total)
  const handleQuantityEdit = (itemId: string, val: string) => {
    const parsed = parseFloat(val) || 0
    setAuditedQuantities(prev => ({
      ...prev,
      [itemId]: parsed
    }))
  }

  // Calculate live totals based on auditedQuantities state
  const liveAuditedTotal = items.reduce((sum, item) => {
    const qty = auditedQuantities[item.id] !== undefined ? auditedQuantities[item.id] : item.quantity
    return sum + (qty * item.rate_at_submission)
  }, 0)

  const bonusPercentage = submission?.payout_bonus_codes?.percentage_bonus || 0
  const bonusAmount = (liveAuditedTotal * bonusPercentage) / 100
  const finalPayoutTotal = liveAuditedTotal + bonusAmount

  const isReadOnlyForStaff = currentAdminUser?.role === 'staff' && submission?.assigned_appraiser_id !== null && submission?.assigned_appraiser_id !== currentAdminUser?.id

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  // Claim appraisal submission for staff appraiser
  const handleClaimSubmission = async (subId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No active appraiser session found.')

      const { error } = await supabase
        .from('submissions')
        .update({
          assigned_appraiser_id: user.id,
          status: 'under_review'
        })
        .eq('id', subId)

      if (error) throw error
      toast.success('Appraisal claimed successfully! Worksheet unlocked.')
      fetchAllData()
    } catch (err: any) {
      toast.error('Failed to claim appraisal: ' + err.message)
    }
  }

  // Apply Payout Bonus Code
  const handleApplyBonusCode = async (codeId: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          applied_bonus_code_id: codeId || null
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Bonus code updated successfully for this submission.')
      fetchAllData()
    } catch (err: any) {
      toast.error('Failed to apply bonus code: ' + err.message)
    }
  }

  // Save Audited worksheet counts to DB
  const handleSaveWorksheet = async () => {
    startTransition(async () => {
      try {
        // 1. Update each submission item
        for (const item of items) {
          const auditedQty = auditedQuantities[item.id]
          const reviewedVal = auditedQty * item.rate_at_submission

          const { error: itemErr } = await supabase
            .from('submission_items')
            .update({
              reviewed_quantity: auditedQty,
              reviewed_value: reviewedVal
            })
            .eq('id', item.id)

          if (itemErr) throw itemErr
        }

        // 2. Update parent submission's final audited total valuation (including bonus)
        const { error: subErr } = await supabase
          .from('submissions')
          .update({
            final_reviewed_valuation: finalPayoutTotal
          })
          .eq('id', id)

        if (subErr) throw subErr

        toast.success('Audited quantities worksheet updated successfully!')
        fetchAllData()
      } catch (err: any) {
        toast.error('Failed to save worksheet counts: ' + err.message)
      }
    })
  }

  // Transition submission status
  const handleTransitionStatus = async (newStatus: Submission['status'], additionalNotes?: string) => {
    startTransition(async () => {
      try {
        const updates: Partial<Submission> = { status: newStatus }
        
        if (newStatus === 'received') {
          updates.date_received = new Date().toISOString()
        }
        if (newStatus === 'rejected' && additionalNotes) {
          updates.rejection_reason = additionalNotes
        }

        const { error } = await supabase
          .from('submissions')
          .update(updates)
          .eq('id', id)

        if (error) throw error

        // Log manual change history
        const { data: authUser } = await supabase.auth.getUser()
        if (authUser.user) {
          await supabase.from('submission_history').insert({
            submission_id: id,
            changed_by: authUser.user.id,
            old_status: submission!.status,
            new_status: newStatus,
            notes: additionalNotes || `Status updated to ${newStatus}`
          })
        }

        toast.success(`Submission status updated to: ${statusConfig[newStatus].label}`)
        setShowRejectModal(false)
        setRejectionReason('')
        fetchAllData()
      } catch (err: any) {
        toast.error('Failed to change status: ' + err.message)
      }
    })
  }

  // Log Payout submit
  const handleLogPayout = async () => {
    if (!payoutReference.trim()) {
      toast.error('Please enter payment reference.')
      return
    }

    startTransition(async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()
        const adminId = authData.user?.id
        if (!adminId) throw new Error('No active admin session found.')

        const amount = submission!.final_reviewed_valuation ?? submission!.estimated_valuation
        const recipientName = sellerProfile?.full_name || submission!.guest_name || 'Seller'

        // 1. Log payment
        const { error: payoutErr } = await supabase
          .from('payouts')
          .upsert({
            submission_id: id,
            method: payoutMethod,
            amount: amount,
            reference_number: payoutReference,
            issued_by: adminId,
            recipient_name: recipientName
          }, { onConflict: 'submission_id' })

        if (payoutErr) throw payoutErr

        // 2. Update status to 'paid'
        const { error: subErr } = await supabase
          .from('submissions')
          .update({ status: 'paid' })
          .eq('id', id)

        if (subErr) throw subErr

        // 3. Log history
        await supabase.from('submission_history').insert({
          submission_id: id,
          changed_by: adminId,
          old_status: submission!.status,
          new_status: 'paid',
          notes: `Payout logged: ${payoutMethod.replace('_', ' ')} (${payoutReference})`
        })

        toast.success('Payout successfully logged and submission marked as Paid.')
        setShowPayoutModal(false)
        setPayoutReference('')
        fetchAllData()
      } catch (err: any) {
        toast.error('Failed to log payout: ' + err.message)
      }
    })
  }

  // Send Chat Message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || !currentAdminUser) return

    try {
      const { error } = await supabase
        .from('submission_messages')
        .insert({
          submission_id: id,
          sender_id: currentAdminUser.id,
          message: chatMessage,
          is_read_by_admin: true,
          is_read_by_seller: false
        })

      if (error) throw error
      setChatMessage('')
      
      // Local immediate insert to avoid wait
      const { data: fullMsg } = await supabase
        .from('submission_messages')
        .select('*, profiles(full_name, email, role)')
        .eq('submission_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (fullMsg && !messages.some(m => m.id === fullMsg.id)) {
        setMessages(prev => [...prev, fullMsg])
      }
    } catch (err: any) {
      toast.error('Failed to send message: ' + err.message)
    }
  }

  // Add Internal Staff Note
  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffNote.trim() || !currentAdminUser) return

    try {
      const { error } = await supabase
        .from('submission_internal_notes')
        .insert({
          submission_id: id,
          note: staffNote,
          created_by: currentAdminUser.id
        })

      if (error) throw error
      setStaffNote('')
      
      // Refetch notes timeline
      const { data: updatedNotes } = await supabase
        .from('submission_internal_notes')
        .select('*, profiles(full_name, email)')
        .eq('submission_id', id)
        .order('created_at', { ascending: true })

      setNotes(updatedNotes || [])
      toast.success('Internal note added.')
    } catch (err: any) {
      toast.error('Failed to add internal note: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FBFBF9] min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
        <p className="text-sm text-slate-500 mt-3 font-semibold">Loading valuation workstation...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex-1 p-8 text-center bg-[#FBFBF9] min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold mt-4 text-[#0B1D2E]">Submission Not Found</h2>
        <Link href="/admin/submissions" className="text-sm font-bold text-[#14452F] mt-2 inline-block underline">
          Return to queue
        </Link>
      </div>
    )
  }

  const currentStatus = statusConfig[submission.status] || { label: submission.status, className: 'bg-slate-50 border-slate-200' }
  const hasChanges = items.some(item => {
    const editVal = auditedQuantities[item.id]
    return editVal !== undefined && editVal !== (item.reviewed_quantity ?? item.quantity)
  })

  return (
    <main className="flex-1 bg-[#FBFBF9] overflow-y-auto min-h-screen pb-16">
      
      {/* Assignment Status Ribbon */}
      {currentAdminUser && (
        <div className={cn(
          "px-6 py-3 text-xs font-semibold border-b flex items-center justify-between gap-4 transition-all duration-300",
          !submission.assigned_appraiser_id 
            ? "bg-amber-50 text-amber-800 border-amber-200" 
            : submission.assigned_appraiser_id === currentAdminUser.id 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-red-50 text-red-800 border-red-200"
        )}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
            <span>
              {!submission.assigned_appraiser_id 
                ? "This appraisal parcel is currently unassigned to any appraiser desk." 
                : submission.assigned_appraiser_id === currentAdminUser.id 
                  ? "Assigned to your desk. You have write permissions for this worksheet." 
                  : `Assigned to Appraiser ${submission.assigned_profile?.full_name || 'Staff'}. Worksheet editing is locked.`}
            </span>
          </div>

          {currentAdminUser.role === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Assign Desk:</span>
              <select
                disabled={isPending}
                value={submission.assigned_appraiser_id || ''}
                onChange={async (e) => {
                  const val = e.target.value || null
                  startTransition(async () => {
                    try {
                      const { error } = await supabase
                        .from('submissions')
                        .update({ assigned_appraiser_id: val })
                        .eq('id', submission.id)
                      if (error) throw error
                      
                      await supabase.from('admin_audit_logs').insert({
                        admin_id: currentAdminUser.id,
                        action_type: 'appraisal_reassigned',
                        target_user_id: val,
                        reason: `Reassigned appraisal VAL-${submission.id.slice(0, 8).toUpperCase()} to ${val ? appraisers.find(a => a.id === val)?.full_name || 'Appraiser' : 'Unassigned'}`
                      })

                      toast.success('Appraiser assignment updated successfully.')
                      setSubmission(prev => prev ? { ...prev, assigned_appraiser_id: val } : null)
                    } catch (err: any) {
                      toast.error('Failed to update assignment: ' + err.message)
                    }
                  })
                }}
                className="bg-white border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-lg p-1 text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
              >
                <option value="">-- Unassigned --</option>
                {appraisers.map(appraiser => (
                  <option key={appraiser.id} value={appraiser.id}>
                    {appraiser.full_name || appraiser.email} ({appraiser.role})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            !submission.assigned_appraiser_id && (submission.status === 'received' || submission.status === 'under_review') && (
              <button
                onClick={() => handleClaimSubmission(submission.id)}
                disabled={isPending}
                className="px-3.5 py-1.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Claim Appraisal'}
              </button>
            )
          )}
        </div>
      )}
      
      {/* Top Navigation Bar */}
      <div className="border-b border-slate-200/60 bg-white sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-xs">
        <div className="flex items-center gap-4 overflow-hidden w-full md:w-auto">
          <Link
            href="/admin/submissions"
            className="p-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-200/80"
          >
            <ArrowLeft className="h-4 w-4 text-slate-655" />
          </Link>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-bold font-mono">VAL-{submission.id.slice(0, 8).toUpperCase()}</span>
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0',
                currentStatus.className
              )}>
                {currentStatus.label}
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-[#0B1D2E] truncate mt-0.5">
              Appraisal Workstation
            </h2>
          </div>
        </div>

        {/* Audit status actions */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print Parcel Slip for Physical Sorting Desk"
          >
            <Printer className="h-3.5 w-3.5 text-[#C5A059]" /> Print Slip
          </button>

          {(submission.status === 'quote_requested' || submission.status === 'received' || submission.status === 'under_review') && (
            <button
              onClick={() => handleTransitionStatus('under_review')}
              disabled={submission.status === 'under_review' || isPending}
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-slate-700 transition-all disabled:opacity-40"
            >
              Start Review
            </button>
          )}

          {submission.status !== 'approved' && submission.status !== 'paid' && submission.status !== 'rejected' && submission.status !== 'cancelled' && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isPending}
                className="px-4 py-2 border border-red-200 hover:border-red-300 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-red-650 transition-all"
              >
                Reject Submission
              </button>

              <button
                onClick={() => handleTransitionStatus('approved')}
                disabled={isPending}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#14452F] hover:bg-[#14452F]/90 text-white shadow-md transition-all flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" /> Approve Appraisal
              </button>
            </>
          )}

          {submission.status === 'approved' && (
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#14452F] hover:bg-[#14452F]/90 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <CreditCard className="h-3.5 w-3.5 text-[#C5A059]" /> Log Payout
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout Grid */}
      <div 
        id="appraisal-split-container"
        className="max-w-7xl mx-auto py-8 px-6 sm:px-8"
        style={{ '--split-width': `${splitWidth}%` } as React.CSSProperties}
      >
        <div className="flex flex-col lg:flex-row gap-0 items-start relative">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8 w-full lg:w-[var(--split-width)] lg:pr-4 shrink-0 transition-all duration-75">
            
            {/* Section 1: Photos Appraisal Panel */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[#0B1D2E] flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#C5A059]" /> Verification Photos
                </h3>
                <span className="text-xs text-slate-400 font-semibold">{images.length} uploaded assets</span>
              </div>

              {images.length === 0 ? (
                <div className="bg-[#FBFBF9]/60 border border-dashed border-slate-200 rounded-2xl py-16 text-center text-slate-400 text-sm">
                  No images uploaded for this submission.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Large Viewport Frame */}
                  <div className="relative border border-slate-100 rounded-2xl h-[420px] bg-slate-900 overflow-hidden flex items-center justify-center">
                    <img
                      src={images[activeImageIndex].image_url}
                      alt="Stamp verification zoom panel"
                      className="max-h-full max-w-full object-contain transition-transform duration-200 origin-center select-none"
                      style={{
                        transform: `scale(${zoomScale}) rotate(${rotateDeg}deg)`
                      }}
                    />
                    
                    {/* Zoom / Rotation canvas Overlay HUD */}
                    <div className="absolute bottom-4 right-4 flex gap-1.5 bg-black/70 backdrop-blur-xs px-3 py-2 rounded-xl text-white border border-white/10 z-10">
                      <button
                        onClick={() => setZoomScale(z => Math.min(z + 0.25, 3))}
                        className="p-1 hover:text-[#C5A059] transition-all cursor-pointer"
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setZoomScale(z => Math.max(z - 0.25, 0.75))}
                        className="p-1 hover:text-[#C5A059] transition-all cursor-pointer"
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setRotateDeg(r => (r + 90) % 360)}
                        className="p-1 hover:text-[#C5A059] transition-all cursor-pointer"
                        title="Rotate 90°"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setZoomScale(1)
                          setRotateDeg(0)
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider pl-1.5 border-l border-white/25 hover:text-[#C5A059] transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Selector list */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => {
                            setActiveImageIndex(idx)
                            setZoomScale(1)
                            setRotateDeg(0)
                          }}
                          className={cn(
                            'relative h-16 w-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all cursor-pointer bg-slate-900',
                            activeImageIndex === idx ? 'border-[#C5A059] ring-2 ring-[#C5A059]/10' : 'border-transparent hover:border-slate-300'
                          )}
                        >
                          <img src={img.image_url} className="h-full w-full object-cover" alt="thumbnail" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: Appraisal Audit Worksheet */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Appraisal Audit Worksheet</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Input the audited physical quantities discovered in the collection parcel.</p>
                </div>
                {hasChanges && (
                  <button
                    onClick={handleSaveWorksheet}
                    disabled={isPending || isReadOnlyForStaff}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#14452F] hover:bg-[#14452F]/90 text-white shadow-md transition-all flex items-center gap-1"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Save Worksheet
                  </button>
                )}
              </div>

              <div className="overflow-x-auto -mx-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
                      <th className="py-3 px-6 text-xs font-bold text-slate-450 uppercase tracking-wider">Stamp Category</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Claimed Qty</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Rate</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Est. Total</th>
                      <th className="py-3 px-6 text-xs font-bold text-[#C5A059] uppercase tracking-wider text-center w-36">Audited Qty</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Audited Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map(item => {
                      const editQty = auditedQuantities[item.id] !== undefined ? auditedQuantities[item.id] : item.quantity
                      const origTotal = item.calculated_value
                      const auditedTotal = editQty * item.rate_at_submission

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/20">
                          <td className="py-3.5 px-6 text-sm">
                            <p className="font-bold text-[#0B1D2E]">{item.stamp_categories?.name || 'Unknown Category'}</p>
                            <p className="text-[10px] text-slate-450 capitalize font-medium">{item.stamp_categories?.group_name || 'Stamp Group'}</p>
                          </td>
                          <td className="py-3.5 px-4 text-sm text-slate-500 text-right font-semibold font-mono">
                            {item.quantity}
                          </td>
                          <td className="py-3.5 px-4 text-sm text-slate-450 text-right font-mono">
                            {formatGBP(item.rate_at_submission)}
                          </td>
                          <td className="py-3.5 px-4 text-sm text-slate-500 text-right font-mono">
                            {formatGBP(origTotal)}
                          </td>
                          <td className="py-3.5 px-6 text-center" onClick={e => e.stopPropagation()}>
                            <input
                              type="number"
                              disabled={isReadOnlyForStaff || submission.status === 'paid' || submission.status === 'approved' || submission.status === 'cancelled' || submission.status === 'rejected'}
                              value={editQty}
                              onChange={(e) => handleQuantityEdit(item.id, e.target.value)}
                              className="w-24 text-center px-2 py-1.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-lg text-sm font-bold font-mono transition-all disabled:bg-slate-50 disabled:opacity-60"
                            />
                          </td>
                          <td className="py-3.5 px-6 text-sm font-black text-[#0B1D2E] text-right font-mono">
                            {formatGBP(auditedTotal)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Two-Way Seller Communication */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-4 flex flex-col h-[480px]">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
                <h3 className="font-serif text-lg font-bold text-[#0B1D2E] flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#C5A059]" /> Two-Way Seller Communication
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Realtime Channel
                </span>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs py-8">
                    No conversation logs recorded yet. Send a message below to start the thread.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isAdminMsg = msg.profiles?.role === 'admin' || msg.profiles?.role === 'staff'
                    const senderName = msg.profiles?.full_name || (isAdminMsg ? 'Valuation Agent' : 'Seller')
                    
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex flex-col max-w-[80%] rounded-2xl p-4.5 text-sm leading-relaxed border',
                          isAdminMsg 
                            ? 'bg-[#0B1D2E] text-white border-[#0B1D2E]/20 ml-auto rounded-tr-none' 
                            : 'bg-[#FBFBF9] text-slate-750 border-slate-200/70 mr-auto rounded-tl-none'
                        )}
                      >
                        <div className="flex justify-between gap-4 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                          <span className={isAdminMsg ? 'text-[#C5A059]' : 'text-slate-400'}>{senderName}</span>
                          <span className="text-slate-500 font-normal">
                            {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Chat input */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 shrink-0 pt-2 border-t border-slate-100">
                {/* Canned replies button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCannedDropdown(!showCannedDropdown)}
                    className="p-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-[#C5A059] rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 h-full"
                    title="Canned Responses"
                  >
                    <span className="text-sm font-bold">⚡</span>
                  </button>

                  {showCannedDropdown && (
                    <div className="absolute bottom-14 left-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2.5 z-40 space-y-1 text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] px-2 py-1">Quick Responses</p>
                      {[
                        { title: 'Request back photos', text: 'Hi, could you please provide a high-resolution, close-up image of the back of this stamp so we can check watermarks / cancellations?' },
                        { title: 'Package received safely', text: 'Hi, we have received your physical stamp parcel safely. Our appraisal team is currently auditing the quantities and checking the conditions.' },
                        { title: 'Appraisal completed', text: 'Hi, we have finished auditing your collection! The final valuation details are updated. Please review them and let us know if you approve.' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setChatMessage(item.text)
                            setShowCannedDropdown(false)
                          }}
                          className="w-full text-left p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group block"
                        >
                          <p className="text-xs font-bold text-slate-750 group-hover:text-[#14452F]">{item.title}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.text}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Type a message to the seller..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all bg-white"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="p-3 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-40 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
 
          </div>

          {/* Resizer Bar (visible on desktop lg+) */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className={cn(
              "hidden lg:block w-1 px-1 self-stretch hover:bg-[#C5A059]/40 active:bg-[#C5A059] cursor-col-resize transition-all select-none mx-2 relative group",
              isResizing && "bg-[#C5A059]"
            )}
          >
            {/* Subtle drag line */}
            <div className="absolute inset-y-0 left-[2px] w-[2px] bg-slate-200/60 group-hover:bg-transparent" />
          </div>
 
          {/* RIGHT COLUMN */}
          <div className="space-y-6 w-full lg:flex-1 lg:pl-4 mt-6 lg:mt-0">
            
            {/* 1. Status & Valuation Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-5">
              <h3 className="font-serif text-md font-bold text-[#0B1D2E] border-b border-slate-100 pb-2">Valuation Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="font-semibold text-slate-500">Estimate Total:</span>
                  <span className="font-bold text-slate-700 font-mono">{formatGBP(submission.estimated_valuation)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="font-semibold text-slate-500">Audited Base:</span>
                  <span className="font-bold text-slate-700 font-mono">{formatGBP(liveAuditedTotal)}</span>
                </div>

                {bonusPercentage > 0 && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 text-amber-700 font-semibold">
                    <span>Bonus ({submission.payout_bonus_codes?.code} +{bonusPercentage}%):</span>
                    <span className="font-mono">+{formatGBP(bonusAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-1.5 text-base font-bold">
                  <span className="font-serif font-black text-[#0B1D2E]">Net Payout:</span>
                  <span className="text-[#14452F] font-mono font-black">
                    {formatGBP(finalPayoutTotal)}
                  </span>
                </div>
              </div>

              {/* Apply Payout Bonus Code Select input */}
              {submission.status !== 'approved' && submission.status !== 'paid' && submission.status !== 'rejected' && submission.status !== 'cancelled' && (
                <div className="pt-3.5 border-t border-slate-100 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Apply Payout Bonus Code</label>
                  <select
                    value={submission.applied_bonus_code_id || ''}
                    onChange={(e) => handleApplyBonusCode(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-lg bg-white font-semibold text-slate-700"
                  >
                    <option value="">No Active Bonus Code</option>
                    {activeBonusCodes.map(code => (
                      <option key={code.id} value={code.id}>
                        {code.code} (+{code.percentage_bonus}%)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {submission.status === 'paid' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Payout Logged</span>
                  <span className="text-xs text-slate-650 block font-medium">Status marked as Paid. Payout records saved.</span>
                </div>
              )}
            </div>

              {/* 2. Seller Context Card */}
            {(() => {
              const meta = parseSubmissionMetadata(submission.description || '')
              const sellingBadge = getSellingOptionBadge(meta.sellingOption)
              const contactBadge = getPreferredContactBadge(meta.preferredContact)
              const shippingBadge = getShippingPreferenceBadge(meta.shippingPreference)
              const sellerPhone = sellerProfile?.phone || submission.guest_phone

              return (
                <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-4">
                  <h3 className="font-serif text-md font-bold text-[#0B1D2E] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <User className="h-4.5 w-4.5 text-[#C5A059]" /> Seller Details
                  </h3>

                  {submission.user_id && sellerProfile ? (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-700 truncate">{sellerProfile.full_name || 'Not provided'}</p>
                          <p className="text-xs text-slate-450 truncate">{sellerProfile.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-450">Verified Seller:</span>
                          <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                            <Shield className="h-3 w-3" /> Yes
                          </span>
                        </div>
                        {sellerProfile.phone && (
                          <div className="flex justify-between">
                            <span className="text-slate-450">Phone:</span>
                            <span className="font-semibold text-slate-650">{sellerProfile.phone}</span>
                          </div>
                        )}
                        {sellerProfile.postcode && (
                          <div className="flex justify-between">
                            <span className="text-slate-450">Postcode:</span>
                            <span className="font-semibold text-slate-650 uppercase">{sellerProfile.postcode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Guest view */
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-amber-600 border border-slate-200">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-700 truncate">{submission.guest_name || 'Guest User'}</p>
                          <p className="text-xs text-slate-450 truncate">{submission.guest_email || ''}</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-450">Access Profile:</span>
                          <span className="font-bold text-amber-600">Guest</span>
                        </div>
                        {submission.guest_phone && (
                          <div className="flex justify-between">
                            <span className="text-slate-450">Phone:</span>
                            <span className="font-semibold text-slate-650">{submission.guest_phone}</span>
                          </div>
                        )}
                        {submission.guest_postcode && (
                          <div className="flex justify-between">
                            <span className="text-slate-450">Postcode:</span>
                            <span className="font-semibold text-slate-650 uppercase">{submission.guest_postcode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Preferences & Selling Pathway */}
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Channel</span>
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border", contactBadge.className)}>
                        <span>{contactBadge.icon}</span> {contactBadge.label}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selling Pathway</span>
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border", sellingBadge.className)}>
                        <span>{sellingBadge.icon}</span> {sellingBadge.label}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping Preference</span>
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border", shippingBadge.className)}>
                        <span>{shippingBadge.icon}</span> {shippingBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Payout preference block */}
                  {sellerProfile?.payout_details && Object.keys(sellerProfile.payout_details).length > 0 && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs space-y-2">
                      <span className="font-bold text-[#0B1D2E] block uppercase text-[9px] tracking-wider">Payout Preference</span>
                      
                      {sellerProfile.payout_details.payout_method === 'bank_transfer' ? (
                        <div className="grid grid-cols-2 gap-1 text-[11px]">
                          <span className="text-slate-450">Method:</span>
                          <span className="font-bold text-[#0B1D2E]">Bank Transfer</span>
                          <span className="text-slate-450">Bank Name:</span>
                          <span className="font-bold text-slate-750">{sellerProfile.payout_details.bank_name || '-'}</span>
                          <span className="text-slate-450">Payee Name:</span>
                          <span className="font-bold text-slate-750">{sellerProfile.payout_details.payee_name || '-'}</span>
                          <span className="text-slate-450">Sort Code:</span>
                          <span className="font-bold text-slate-750 font-mono">{sellerProfile.payout_details.sort_code || '-'}</span>
                          <span className="text-slate-450">Acc Number:</span>
                          <span className="font-bold text-slate-750 font-mono">{sellerProfile.payout_details.account_number || '-'}</span>
                        </div>
                      ) : sellerProfile.payout_details.payout_method === 'cheque' ? (
                        <div className="grid grid-cols-2 gap-1 text-[11px]">
                          <span className="text-slate-450">Method:</span>
                          <span className="font-bold text-[#0B1D2E]">Cheque</span>
                          <span className="text-slate-450">Recipient:</span>
                          <span className="font-bold text-slate-750">{sellerProfile.payout_details.cheque_recipient || '-'}</span>
                          <span className="text-slate-450">Address:</span>
                          <span className="font-bold text-slate-750">{sellerProfile.payout_details.cheque_address || '-'}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400">No payout method selected.</p>
                      )}
                    </div>
                  )}

                  {/* Quick Communication Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Manual Outreach Helpers</span>
                    {(() => {
                      const email = sellerProfile?.email || submission.guest_email
                      const name = sellerProfile?.full_name || submission.guest_name || 'Customer'
                      const mailtoUrl = email ? `mailto:${email}?subject=${encodeURIComponent(`UK Stamp Valuations - Valuation Request #VAL-${submission.id.slice(0, 8).toUpperCase()}`)}&body=${encodeURIComponent(`Dear ${name},\n\nThank you for submitting your ${submission.collection_type.replace(/_/g, ' ')} collection for valuation.\n\nValuation Reference: VAL-${submission.id.slice(0, 8).toUpperCase()}\nCalculated Payout Offer: ${formatGBP(finalPayoutTotal)}\n\nNext Steps:\nIf you wish to proceed, please post your stamps safely packaged to our processing center.\n\nBest regards,\nUK Stamp Valuations Team`)}` : '#'

                      return (
                        <div className="flex flex-col gap-2">
                          {sellerPhone && (
                            <>
                              <a
                                href={`tel:${sellerPhone}`}
                                className="w-full py-2 px-3 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Phone className="h-3.5 w-3.5 text-[#C5A059]" /> Call {sellerPhone}
                              </a>
                              <a
                                href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${name}, this is Sell Your Stamps UK regarding your valuation request VAL-${submission.id.slice(0, 8).toUpperCase()}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5 text-white" /> WhatsApp Customer
                              </a>
                            </>
                          )}

                          {email && (
                            <a
                              href={mailtoUrl}
                              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5 text-[#C5A059]" /> Open Email Launcher
                            </a>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={handleCopyQuoteEmail}
                              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-[10px] font-bold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Copy className="h-3 w-3 text-slate-400" /> Copy Quote
                            </button>
                            <button
                              type="button"
                              onClick={handleCopyShippingAdvice}
                              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-[10px] font-bold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Copy className="h-3 w-3 text-slate-400" /> Copy Pack Advice
                            </button>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )
            })()}

            {/* 3. Internal Staff Notes */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-4">
              <h3 className="font-serif text-md font-bold text-[#0B1D2E] border-b border-slate-100 pb-2">
                Internal Staff Notes
              </h3>

              {/* Private Notes timeline scroll */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {notes.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No internal staff notes recorded.</p>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="p-3 bg-amber-500/[0.04] border border-amber-500/10 rounded-xl space-y-1">
                      <p className="text-xs text-slate-700 leading-normal">{note.note}</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase pt-1.5 border-t border-slate-500/[0.05]">
                        <span>{note.profiles?.full_name || 'Staff Appraiser'}</span>
                        <span className="font-normal text-slate-400">
                          {new Date(note.created_at).toLocaleDateString('en-GB')} {new Date(note.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddInternalNote} className="space-y-2 pt-2 border-t border-slate-100">
                <textarea
                  required
                  rows={2}
                  placeholder="Add private appraiser note..."
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  className="w-full p-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-xs bg-[#FBFBF9]/30 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={!staffNote.trim()}
                  className="w-full py-2 bg-[#0B1D2E] hover:bg-[#0B1D2E]/90 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
                >
                  Add Note
                </button>
              </form>
            </div>

            {/* 4. Audit History Logs */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-4 sm:p-6 space-y-5">
              <h3 className="font-serif text-md font-bold text-[#0B1D2E] border-b border-slate-100 pb-2">
                Milestone History
              </h3>

              <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-4 max-h-[220px] overflow-y-auto">
                {history.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    {/* Ring indicator */}
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white ring-2 ring-slate-100" />
                    
                    <p className="font-bold text-slate-700 capitalize">
                      {log.new_status.replace('_', ' ')}
                    </p>
                    {log.notes && <p className="text-slate-500 mt-0.5">{log.notes}</p>}
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                      {log.profiles?.full_name || 'System'} • {new Date(log.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
 
        </div>
      </div>

      {/* Sticky Bottom Actions Ribbon */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1D2E]/95 backdrop-blur-xs border-t border-[#C5A059]/20 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-30 shadow-2xl px-4 sm:px-12 animate-slide-up">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-white flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">Estimated Total</span>
            <span className="font-mono font-bold text-slate-200">{formatGBP(submission.estimated_valuation)}</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-white/10" />
          <div>
            <span className="text-[#C5A059] text-[10px] block uppercase tracking-wider font-bold">Audited Base</span>
            <span className="font-mono font-bold text-slate-200 block">
              {formatGBP(liveAuditedTotal)}
            </span>
          </div>
          {bonusPercentage > 0 && (
            <>
              <div className="hidden sm:block h-8 w-px bg-white/10" />
              <div>
                <span className="text-amber-500 text-[10px] block uppercase tracking-wider font-bold">Bonus ({submission.payout_bonus_codes?.code})</span>
                <span className="font-mono font-bold text-amber-400 block">
                  +{formatGBP(bonusAmount)}
                </span>
              </div>
            </>
          )}
          <div className="hidden sm:block h-8 w-px bg-white/10" />
          <div>
            <span className="text-emerald-400 text-[10px] block uppercase tracking-wider font-bold">Net Payout</span>
            <span className="font-mono font-black text-white text-base block">
              {formatGBP(finalPayoutTotal)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          {hasChanges && (
            <button
              onClick={handleSaveWorksheet}
              disabled={isPending || isReadOnlyForStaff}
              className="flex-1 sm:flex-none justify-center px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/30 hover:border-[#C5A059] bg-white/5 hover:bg-white/10 text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 text-[#C5A059]" />}
              Save Progress
            </button>
          )}

          {submission.status !== 'approved' && submission.status !== 'paid' && submission.status !== 'rejected' && submission.status !== 'cancelled' && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isPending || isReadOnlyForStaff}
                className="flex-1 sm:flex-none text-center px-4.5 py-2.5 border border-red-200/20 hover:border-red-300/40 text-xs font-bold uppercase tracking-wider rounded-xl bg-red-950/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => handleTransitionStatus('approved')}
                disabled={isPending || isReadOnlyForStaff}
                className="flex-1 sm:flex-none justify-center px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#14452F] hover:bg-[#14452F]/90 text-white shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" /> Approve Appraisal
              </button>
            </>
          )}

          {submission.status === 'approved' && currentAdminUser?.role !== 'staff' && (
            <button
              onClick={() => setShowPayoutModal(true)}
              className="flex-1 sm:flex-none justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#14452F] hover:bg-[#14452F]/90 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="h-3.5 w-3.5 text-[#C5A059]" /> Log Payout
            </button>
          )}
        </div>
      </div>

      {/* Log Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">Log Valuation Payout</h3>
                <p className="text-xs text-slate-500 mt-1">This will record payment details and mark this submission as Paid.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Total Amount to Disburse</label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-250/20 text-center font-mono font-black text-xl text-[#14452F]">
                    {formatGBP(submission.final_reviewed_valuation ?? submission.estimated_valuation)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('bank_transfer')}
                      className={cn(
                        'py-3 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center',
                        payoutMethod === 'bank_transfer'
                          ? 'border-[#14452F] bg-[#14452F]/5 text-[#14452F]'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      )}
                    >
                      Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('cheque')}
                      className={cn(
                        'py-3 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center',
                        payoutMethod === 'cheque'
                          ? 'border-[#14452F] bg-[#14452F]/5 text-[#14452F]'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      )}
                    >
                      Cheque
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Transaction Reference / Cheque #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TXN9876543210"
                    value={payoutReference}
                    onChange={(e) => setPayoutReference(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayoutModal(false)
                    setPayoutReference('')
                  }}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || !payoutReference.trim()}
                  onClick={handleLogPayout}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Submission Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-red-500" />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-red-650">Reject Valuation Submission</h3>
                <p className="text-xs text-slate-500 mt-1">Please enter the reason for rejecting this valuation. This will be visible to the seller.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Rejection Reason</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain why the stamps are rejected (e.g. invalid conditions, unbarcoded regionals, damaged collections)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-4 border border-slate-200 focus:border-red-400 focus:outline-none rounded-xl text-sm transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || !rejectionReason.trim()}
                  onClick={() => handleTransitionStatus('rejected', rejectionReason)}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-red-650 hover:bg-red-700 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Parcel Slip Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl border border-slate-150 shadow-2xl max-w-2xl w-full overflow-hidden relative animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-w-none print:rounded-none">
            <div className="h-2 bg-gradient-to-r from-[#C5A059] to-[#14452F] print:hidden" />
            
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0B1D2E]">UK Stamp Valuations</h2>
                  <p className="text-xs text-slate-500 font-medium">Physical Sorting Deck Audit Slip</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#0B1D2E] block">VAL-{submission.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">{new Date(submission.created_at).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Grid 1: Customer Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Customer Name</span>
                  <span className="font-bold text-[#0B1D2E] text-sm">{sellerProfile?.full_name || submission.guest_name || 'Guest User'}</span>
                  <span className="text-slate-500 block mt-0.5">{sellerProfile?.email || submission.guest_email || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Location & Contact</span>
                  <span className="font-bold text-[#0B1D2E] block uppercase">{sellerProfile?.postcode || submission.guest_postcode || 'No Postcode'}</span>
                  <span className="text-slate-500 block">{sellerProfile?.phone || submission.guest_phone || 'No Phone'}</span>
                </div>
              </div>

              {/* Grid 2: Collection Overview */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/60 rounded-xl border border-slate-100 font-semibold text-slate-700">
                  <div>Type: <span className="font-bold capitalize">{submission.collection_type.replace(/_/g, ' ')}</span></div>
                  <div>Quantity: <span className="font-bold">{submission.approx_quantity}</span></div>
                  <div>Era: <span className="font-bold">{submission.estimated_era}</span></div>
                </div>

                {submission.description && (
                  <div className="p-3 bg-slate-50/40 rounded-xl border border-slate-100 text-slate-600 italic">
                    <span className="font-bold not-italic text-slate-700 block text-[10px] uppercase font-mono">Description:</span>
                    {submission.description}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Audited Item Breakdown</span>
                <table className="w-full text-xs border-collapse text-left border border-slate-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3 text-center">Claimed</th>
                      <th className="py-2 px-3 text-center">Audited</th>
                      <th className="py-2 px-3 text-right">Rate</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map(item => {
                      const editQty = auditedQuantities[item.id] !== undefined ? auditedQuantities[item.id] : item.quantity
                      const subtotal = editQty * item.rate_at_submission
                      return (
                        <tr key={item.id}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{item.stamp_categories?.name || 'Category'}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-500">{item.quantity}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-[#0B1D2E]">{editQty}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-500">{formatGBP(item.rate_at_submission)}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">{formatGBP(subtotal)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total Banner */}
              <div className="flex justify-between items-center p-4 bg-[#0B1D2E] text-white rounded-2xl font-serif">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] block">Final Net Payout Offer</span>
                  <span className="text-xs text-slate-300 font-sans">Status: <span className="capitalize font-bold text-white">{submission.status.replace(/_/g, ' ')}</span></span>
                </div>
                <span className="text-2xl font-black font-mono text-emerald-400">{formatGBP(finalPayoutTotal)}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 print:hidden">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-4 w-4" /> Print Parcel Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
