import { NextResponse } from 'next/server'
import { notifyNewContactLead } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('Received contact form submission:', data)

    // Trigger business notification
    await notifyNewContactLead({
      name: data.name || data.fullName || 'Anonymous',
      email: data.email,
      phone: data.phone,
      subject: data.subject || 'Website Inquiry',
      message: data.message || '',
    }).catch((err) => {
      console.error('Failed to notify new contact lead:', err)
    })

    return NextResponse.json(
      { message: 'Message received successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { message: 'Failed to process message' },
      { status: 500 }
    )
  }
}
