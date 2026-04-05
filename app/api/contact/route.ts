import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('Received contact form submission:', data)

    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 600))

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
