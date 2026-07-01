import React from 'react'
import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ReceiptPrintClient } from '@/components/dashboard/receipt-print-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReceiptPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  // Retrieve user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Retrieve user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch the submission
  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (!submission) {
    notFound()
  }

  // Fetch items with categories
  const { data: itemsData } = await supabase
    .from('submission_items')
    .select(`
      id,
      quantity,
      rate_at_submission,
      face_value_at_submission,
      calculated_value,
      reviewed_quantity,
      reviewed_value,
      stamp_categories (
        name,
        group_name
      )
    `)
    .eq('submission_id', id)

  // Fetch payout details
  const { data: payout } = await supabase
    .from('payouts')
    .select('*')
    .eq('submission_id', id)
    .maybeSingle()

  const items = (itemsData || []).map(item => ({
    ...item,
    quantity: Number(item.quantity),
    rate_at_submission: Number(item.rate_at_submission),
    face_value_at_submission: Number(item.face_value_at_submission),
    calculated_value: Number(item.calculated_value),
    reviewed_quantity: item.reviewed_quantity !== null ? Number(item.reviewed_quantity) : null,
    reviewed_value: item.reviewed_value !== null ? Number(item.reviewed_value) : null,
  }))

  const cleanSubmission = {
    ...submission,
    estimated_valuation: Number(submission.estimated_valuation),
    final_reviewed_valuation: submission.final_reviewed_valuation ? Number(submission.final_reviewed_valuation) : null,
  }

  const sellerName = profile?.full_name || submission.guest_name || user.email!.split('@')[0]
  const sellerEmail = user.email!

  return (
    <ReceiptPrintClient
      submission={cleanSubmission as any}
      items={items as any}
      payout={payout as any}
      sellerName={sellerName}
      sellerEmail={sellerEmail}
    />
  )
}
