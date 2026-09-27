import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { notifyNewValuationLead } from '@/lib/notifications'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are required.')
  }
  return createClient(url, serviceKey)
}

interface ParsedItem {
  categoryId: string
  quantity: number
  rateAtSubmission: number
  faceValueAtSubmission: number
  calculatedValue: number
}

/**
 * Parses the valuation description to extract categories, quantities, and estimates.
 */
function parseSubmissionDescription(description: string, categories: any[]): {
  items: ParsedItem[]
  estimatedValuation: number
} {
  const items: ParsedItem[] = []
  let estimatedValuation = 0

  // 1. Check if description has "Calculated via tool:"
  if (description.includes('Calculated via tool:')) {
    const lines = description.split('\n')
    for (const line of lines) {
      // Format 1: - £10.00 Face Value of 1st Class Purple Sheets of 25/50
      // Format 2: - 5x 1st Class Purple Sheets of 25/50
      const decimalMatch = line.match(/^-\s+£([\d.]+)\s+Face\s+Value\s+of\s+(.+)$/)
      const qtyMatch = line.match(/^-\s+(\d+)x?\s+(.+)$/)

      let qty = 0
      let catName = ''

      if (decimalMatch) {
        qty = parseFloat(decimalMatch[1])
        catName = decimalMatch[2].trim()
      } else if (qtyMatch) {
        qty = parseInt(qtyMatch[1], 10)
        catName = qtyMatch[2].trim()
      }

      if (qty > 0 && catName) {
        // Find category matching name or id case-insensitively
        const category = categories.find(
          c => c.name.toLowerCase() === catName.toLowerCase() ||
               c.id.toLowerCase() === catName.toLowerCase()
        )
        if (category) {
          const rate = parseFloat(category.rate)
          const fv = parseFloat(category.face_value)
          const calculatedValue = qty * fv * rate
          items.push({
            categoryId: category.id,
            quantity: qty,
            rateAtSubmission: rate,
            faceValueAtSubmission: fv,
            calculatedValue: calculatedValue
          })
        }
      }
    }

    // Attempt to match the calculated total estimate
    const totalMatch = description.match(/Total Est\. Payout:\s+£([\d.]+)/)
    if (totalMatch) {
      estimatedValuation = parseFloat(totalMatch[1])
    } else {
      // Fallback to sum of items
      estimatedValuation = items.reduce((sum, item) => sum + item.calculatedValue, 0)
    }
  }

  // 2. Check if description has homepage lock-in offer: "Estimated at £45.00 - £50.00"
  const lockInMatch = description.match(/Estimated at\s+£([\d.]+)\s*-\s*£([\d.]+)/)
  if (lockInMatch) {
    estimatedValuation = parseFloat(lockInMatch[1])
  }

  return { items, estimatedValuation }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      fullName,
      email,
      phone,
      postcode,
      collectionType,
      quantity,
      era,
      description,
      valuableItems,
      images, // Expected array of { file_path: string, image_url: string }
    } = data

    console.log('Received sell form submission:', data)

    // Validate required fields
    if (!fullName || !email || !postcode || !collectionType || !quantity || !era || !description) {
      return NextResponse.json(
        { message: 'Missing required appraisal submission fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address format' },
        { status: 400 }
      )
    }

    // Get current authenticated user session if available
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Autosave user profile details if they are logged in and missing profile fields
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, postcode')
        .eq('id', user.id)
        .single()

      const updates: any = {}
      if (!profile?.full_name && fullName) {
        updates.full_name = fullName.trim()
      }
      if (!profile?.phone && phone) {
        updates.phone = phone.trim()
      }
      if (!profile?.postcode && postcode) {
        updates.postcode = postcode.trim().toUpperCase()
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)

        if (updateError) {
          console.error('Error autosaving profile details from submission:', updateError)
        } else {
          console.log('Successfully autosaved profile details from valuation submission:', updates)
        }
      }
    }

    // Validate image files in Supabase Storage
    const imageList = Array.isArray(images) ? images : []
    if (imageList.length > 10) {
      return NextResponse.json(
        { message: 'Maximum of 10 image uploads allowed per submission' },
        { status: 400 }
      )
    }

    const supabaseAdmin = imageList.length > 0 ? getSupabaseAdmin() : null

    for (const img of imageList) {
      if (!img.file_path || !img.image_url) {
        return NextResponse.json(
          { message: 'Invalid image payload format' },
          { status: 400 }
        )
      }

      // Path Prefix Security check
      const isValidPrefix = img.file_path.startsWith('guest/') || (user && img.file_path.startsWith(`${user.id}/`))
      if (!isValidPrefix) {
        return NextResponse.json(
          { message: `Unauthorized image storage directory prefix: ${img.file_path}` },
          { status: 400 }
        )
      }

      // Fetch storage file metadata via admin client to bypass client-level RLS restrictions
      const { data: metadata, error: metaError } = await supabaseAdmin!.storage
        .from('submissions')
        .info(img.file_path)

      if (metaError || !metadata) {
        console.error('Metadata error for file:', img.file_path, metaError)
        return NextResponse.json(
          { message: `Image file not found or inaccessible in storage: ${img.file_path}` },
          { status: 400 }
        )
      }

      // Verify file size limit (10MB)
      const size = metadata.size
      if (!size || size > 10485760) {
        return NextResponse.json(
          { message: `Image file exceeds the 10MB limit or is empty: ${img.file_path}` },
          { status: 400 }
        )
      }

      // Verify file mimetype (which is camelCased to contentType by the SDK info response)
      const contentType = metadata.contentType || ''
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(contentType)) {
        return NextResponse.json(
          { message: `Unsupported image file type (${contentType}): ${img.file_path}` },
          { status: 400 }
        )
      }
    }

    // Fetch active stamp categories to match description details
    const { data: categories, error: catError } = await supabase
      .from('stamp_categories')
      .select('id, name, face_value, rate')

    if (catError) {
      console.error('Failed to fetch stamp categories:', catError)
      return NextResponse.json(
        { message: 'Internal database error' },
        { status: 500 }
      )
    }

    // Parse estimate valuation and categories from description
    const { items, estimatedValuation } = parseSubmissionDescription(description, categories || [])

    // Insert record into submissions table
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        user_id: user ? user.id : null,
        guest_name: user ? null : fullName.trim(),
        guest_email: user ? null : email.trim().toLowerCase(),
        guest_phone: user ? null : phone.trim(),
        guest_postcode: user ? null : postcode.trim().toUpperCase(),
        collection_type: collectionType,
        approx_quantity: quantity,
        estimated_era: era,
        description: description,
        valuable_items: valuableItems ? valuableItems.trim() : null,
        estimated_valuation: estimatedValuation,
        status: 'quote_requested'
      })
      .select('id')
      .single()

    if (submissionError || !submission) {
      console.error('Error inserting submission:', submissionError)
      return NextResponse.json(
        { message: 'Failed to save submission to database' },
        { status: 500 }
      )
    }

    // Insert items if any were parsed
    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('submission_items')
        .insert(
          items.map(item => ({
            submission_id: submission.id,
            category_id: item.categoryId,
            quantity: item.quantity,
            rate_at_submission: item.rateAtSubmission,
            face_value_at_submission: item.faceValueAtSubmission,
            calculated_value: item.calculatedValue
          }))
        )

      if (itemsError) {
        console.error('Error inserting submission items:', itemsError)
        // Rollback parent insertion on failure
        await supabase.from('submissions').delete().eq('id', submission.id)
        return NextResponse.json(
          { message: 'Failed to save valuation items to database' },
          { status: 500 }
        )
      }
    }

    // Insert image relationships
    if (imageList.length > 0) {
      const { error: imagesError } = await supabase
        .from('submission_images')
        .insert(
          imageList.map(img => ({
            submission_id: submission.id,
            image_url: img.image_url,
            file_path: img.file_path
          }))
        )

      if (imagesError) {
        console.error('Error inserting submission images:', imagesError)
        // Rollback parent insertion on failure (cascade will delete items)
        await supabase.from('submissions').delete().eq('id', submission.id)
        return NextResponse.json(
          { message: 'Failed to save valuation images to database' },
          { status: 500 }
        )
      }
    }

    // Trigger business notification alert
    await notifyNewValuationLead({
      submissionId: submission.id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      postcode: postcode.trim().toUpperCase(),
      collectionType,
      quantity,
      era,
      description,
      valuableItems: valuableItems ? valuableItems.trim() : null,
      estimatedValuation,
      imageCount: imageList.length,
    }).catch((err) => {
      console.error('Failed to notify new valuation lead:', err)
    })

    return NextResponse.json(
      { message: 'Submission received successfully', submissionId: submission.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { message: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
