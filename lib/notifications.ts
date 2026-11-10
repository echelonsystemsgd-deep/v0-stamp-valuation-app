import { BUSINESS_CONFIG } from '@/data/business'

export interface ValuationNotificationData {
  submissionId: string
  fullName: string
  email: string
  phone: string
  postcode: string
  collectionType: string
  quantity: string
  era: string
  description: string
  valuableItems?: string | null
  estimatedValuation: number
  imageCount: number
  preferredContact?: string
  sellingOption?: string
}

export interface ContactNotificationData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

/**
 * Lead Notification Engine & Transactional Email Hub
 * 
 * Configured for Resend (Free tier: 3,000 emails/mo, 100/day):
 * - Alerts business owner/head buyer on every incoming inquiry or valuation
 * - Automatically sends high-trust branded confirmation email to customer
 * 
 * Required Environment Variables (see .env):
 * - RESEND_API_KEY: Resend API key (re_xxxx)
 * - LEAD_NOTIFICATION_EMAIL: Where business alerts are sent (e.g., ali_nawaz122@outlook.com or valuations@sellyourstamps.co.uk)
 * - LEAD_WEBHOOK_URL: Optional webhook for Slack, Discord, or automation flows
 */

// Helper to send email via Resend REST API
async function sendEmailViaResend({
  from,
  to,
  subject,
  html,
}: {
  from: string
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[RESEND SIMULATION] Email to ${to} with subject "${subject}" (RESEND_API_KEY not set).`)
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('[RESEND API ERROR]:', errorText)
      return false
    }
    return true
  } catch (err) {
    console.error('[RESEND DISPATCH ERROR]:', err)
    return false
  }
}

/**
 * 1. Alert Business Owner (Ali / Head Buyer) on new valuation
 */
export async function notifyNewValuationLead(data: ValuationNotificationData): Promise<{ sent: boolean; channel: string }> {
  const alertDestination = process.env.LEAD_NOTIFICATION_EMAIL || BUSINESS_CONFIG.valuationEmail
  const webhookUrl = process.env.LEAD_WEBHOOK_URL

  console.log(`[LEAD ALERT] New Valuation Submission #${data.submissionId}:`, {
    submitter: `${data.fullName} (${data.email}, ${data.phone || 'No phone'})`,
    postcode: data.postcode,
    collection: `${data.collectionType} - ${data.quantity} stamps (${data.era})`,
    estimatedPayout: `£${data.estimatedValuation.toFixed(2)}`,
    photosAttached: data.imageCount,
    targetAlertEmail: alertDestination,
  })

  // 1. Webhook (Slack, Discord, CRM)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 *New Stamp Valuation Request* (£${data.estimatedValuation.toFixed(2)})\n*Name:* ${data.fullName}\n*Email:* ${data.email}\n*Phone:* ${data.phone}\n*Preferred Contact:* ${data.preferredContact || 'Phone Call'}\n*Selling Method:* ${data.sellingOption || 'Box & Send'}\n*Collection:* ${data.collectionType} (${data.quantity})\n*Photos:* ${data.imageCount}\n*ID:* ${data.submissionId}`,
        }),
      })
    } catch (err) {
      console.error('[LEAD ALERT ERROR] Failed to dispatch lead webhook:', err)
    }
  }

  // 2. Email alert to business
  const businessSubject = `🚨 New Stamp Valuation Lead: £${data.estimatedValuation.toFixed(2)} - ${data.fullName}`
  const businessHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #14452F; padding-bottom: 10px;">New Stamp Valuation Request</h2>
      <p style="font-size: 16px;"><strong>Reference ID:</strong> ${data.submissionId}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Seller Name:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.fullName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${data.phone}">${data.phone || 'N/A'}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Postcode:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.postcode}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Contact Preference:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.preferredContact || 'Phone Call'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Selling Option:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.sellingOption || 'Box & Send'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Estimated Valuation:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #14452F; font-size: 18px; font-weight: bold;">£${data.estimatedValuation.toFixed(2)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Collection Type:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.collectionType}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Quantity & Era:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.quantity} (${data.era})</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Photos Attached:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.imageCount} image(s)</td></tr>
      </table>

      <h3 style="color: #0f172a; margin-bottom: 8px;">Description & Items:</h3>
      <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; white-space: pre-wrap; border: 1px solid #cbd5e1;">${data.description}</div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        Sent automatically by Sell Your Stamps UK Platform System.
      </div>
    </div>
  `

  const sent = await sendEmailViaResend({
    from: `Sell Your Stamps Alerts <notifications@${BUSINESS_CONFIG.domain}>`,
    to: alertDestination,
    subject: businessSubject,
    html: businessHtml,
  })

  // 3. Trigger immediate customer auto-confirmation email
  await sendCustomerValuationConfirmation(data).catch((err) => {
    console.error('[CUSTOMER EMAIL ERROR] Failed to send valuation confirmation:', err)
  })

  return { sent, channel: sent ? 'email' : 'log_only' }
}

/**
 * 2. Send Customer Confirmation Auto-Reply (Guarantees immediate reassurance)
 */
export async function sendCustomerValuationConfirmation(data: ValuationNotificationData): Promise<boolean> {
  const customerSubject = `Valuation Request Received: #${data.submissionId.slice(0, 8).toUpperCase()} - Sell Your Stamps UK`
  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; border-bottom: 2px solid #14452F; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #14452F; margin: 0; font-size: 24px; letter-spacing: -0.5px;">Sell Your Stamps UK</h1>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Expert Stamp Valuation & Purchasing</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${data.fullName}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6; color: #334155;">
        Thank you for submitting your stamps for valuation. We have safely received your details and our head buyer is currently reviewing your collection.
      </p>

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 16px;">What Happens Next?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px; line-height: 1.7;">
          <li><strong>Review Within 1–12 Hours:</strong> All stamps are carefully checked by our head buyer before any formal offer.</li>
          <li><strong>Official Quote:</strong> We will contact you via your preferred method (<strong>${data.preferredContact || 'phone call'}</strong>) with a fair market valuation.</li>
          <li><strong>Zero Obligation:</strong> Our appraisal is 100% free with no obligation to sell.</li>
          <li><strong>Same-Day Payment:</strong> Once agreed and received via Royal Mail Special Delivery / Signed For service, payment is processed same-day.</li>
        </ul>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px;">Summary of Your Submission:</h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Reference:</strong> #${data.submissionId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Collection Type:</strong> ${data.collectionType}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Estimated Quantity:</strong> ${data.quantity} (${data.era})</p>
        ${data.estimatedValuation > 0 ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Indicative Estimate:</strong> £${data.estimatedValuation.toFixed(2)}</p>` : ''}
        <p style="margin: 4px 0; font-size: 13px;"><strong>Photos Provided:</strong> ${data.imageCount} file(s)</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
        Need to update your submission or have an urgent query? Simply reply directly to this email or call our team on <strong>${BUSINESS_CONFIG.phone}</strong>.
      </p>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p style="margin: 0 0 4px 0;"><strong>Sell Your Stamps UK</strong> • Nationwide Stamp Buying Desk</p>
        <p style="margin: 0;">Discreet Service • Royal Mail Special Delivery / Signed For • Insured up to £50,000</p>
      </div>
    </div>
  `

  return sendEmailViaResend({
    from: `Sell Your Stamps UK <info@${BUSINESS_CONFIG.domain}>`,
    to: data.email,
    subject: customerSubject,
    html: customerHtml,
  })
}

/**
 * 3. Alert Business Owner on new general contact form message
 */
export async function notifyNewContactLead(data: ContactNotificationData): Promise<{ sent: boolean; channel: string }> {
  const alertDestination = process.env.LEAD_NOTIFICATION_EMAIL || BUSINESS_CONFIG.email
  const webhookUrl = process.env.LEAD_WEBHOOK_URL

  console.log(`[CONTACT INQUIRY] New Message from ${data.name} (${data.email}):`, {
    subject: data.subject,
    phone: data.phone || 'N/A',
    messagePreview: data.message.slice(0, 100),
    targetAlertEmail: alertDestination,
  })

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `📬 *New Website Inquiry*\n*From:* ${data.name} (${data.email})\n*Subject:* ${data.subject}\n*Message:* ${data.message}`,
        }),
      })
    } catch (err) {
      console.error('[LEAD ALERT ERROR] Failed to dispatch contact webhook:', err)
    }
  }

  const businessHtml = `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #14452F; padding-bottom: 8px;">New Contact Form Message</h2>
      <p><strong>From:</strong> ${data.name} (&lt;<a href="mailto:${data.email}">${data.email}</a>&gt;)</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${data.message}</p>
    </div>
  `

  const sent = await sendEmailViaResend({
    from: `Sell Your Stamps Contact <notifications@${BUSINESS_CONFIG.domain}>`,
    to: alertDestination,
    subject: `New Inquiry: ${data.subject} - ${data.name}`,
    html: businessHtml,
  })

  // Customer acknowledgement
  await sendCustomerContactConfirmation(data).catch((err) => {
    console.error('[CUSTOMER CONTACT CONFIRMATION ERROR]:', err)
  })

  return { sent, channel: sent ? 'email' : 'log_only' }
}

/**
 * 4. Customer Acknowledgement for Contact Inquiries
 */
export async function sendCustomerContactConfirmation(data: ContactNotificationData): Promise<boolean> {
  const customerHtml = `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #14452F; margin-top: 0;">We've received your message</h2>
      <p>Hello ${data.name},</p>
      <p>Thank you for getting in touch with Sell Your Stamps UK. One of our team members will respond to your query regarding <em>"${data.subject}"</em> as quickly as possible (usually within 1–12 hours).</p>
      <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 16px 0; font-size: 14px;">
        <strong>Your Message:</strong><br />${data.message}
      </div>
      <p style="font-size: 13px; color: #64748b;">Best regards,<br /><strong>Sell Your Stamps UK Team</strong></p>
    </div>
  `

  return sendEmailViaResend({
    from: `Sell Your Stamps UK <info@${BUSINESS_CONFIG.domain}>`,
    to: data.email,
    subject: `Message Received: ${data.subject} - Sell Your Stamps UK`,
    html: customerHtml,
  })
}
