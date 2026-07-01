import React from 'react'
import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SubmissionDetailClient } from '@/components/dashboard/submission-detail-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  // Retrieve user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch specific submission (RLS handles security)
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
      submission_id,
      category_id,
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

  // Fetch images
  const { data: images } = await supabase
    .from('submission_images')
    .select('id, image_url, file_path')
    .eq('submission_id', id)

  // Fetch messages with profile details
  const { data: messagesData } = await supabase
    .from('submission_messages')
    .select(`
      id,
      submission_id,
      sender_id,
      message,
      is_read_by_admin,
      is_read_by_seller,
      created_at,
      profiles (
        full_name,
        email,
        role
      )
    `)
    .eq('submission_id', id)
    .order('created_at', { ascending: true })

  // Clean data types for serialization
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

  return (
    <SubmissionDetailClient
      initialSubmission={cleanSubmission as any}
      initialItems={items as any}
      initialImages={images || []}
      initialMessages={(messagesData || []) as any}
      userId={user.id}
      userEmail={user.email!}
    />
  )
}
