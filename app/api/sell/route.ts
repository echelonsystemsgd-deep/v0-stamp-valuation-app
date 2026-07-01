import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { fullName, phone, postcode } = data
    
    console.log('Received sell form submission:', data)

    // Autosave user profile details if they are logged in and missing profile fields
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // 1. Fetch current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, postcode')
        .eq('id', user.id)
        .single()

      // 2. Determine updates
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

      // 3. Write updates if any exist
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

    // Simulate database delay for submission
    await new Promise(resolve => setTimeout(resolve, 800))

    return NextResponse.json(
      { message: 'Submission received successfully' },
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
