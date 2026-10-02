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
  shippingPreference?: string
}

export interface ContactNotificationData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

/**
 * Lead Notification Engine
 * 
 * NOTE FOR CLIENT / STAKEHOLDERS:
 * This service ensures valuation requests and customer inquiries alert the business owner immediately.
 * 
 * To enable real-time delivery:
 * 1. Webhooks (Slack/Discord/WhatsApp): Set LEAD_WEBHOOK_URL in .env
 * 2. Transactional Email (Resend/SendGrid/SES): Set RESEND_API_KEY in .env
 * 3. Alert Destination: Set LEAD_NOTIFICATION_EMAIL (defaults to valuations@sellyourstamps.co.uk)
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

  // 1. Webhook Notification (Slack, Discord, Zapier, WhatsApp CRM)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 *New Stamp Valuation Request* (£${data.estimatedValuation.toFixed(2)})\n*Name:* ${data.fullName}\n*Email:* ${data.email}\n*Phone:* ${data.phone}\n*Preferred Contact:* ${data.preferredContact || 'Phone Call'}\n*Selling Method:* ${data.sellingOption || 'Box & Send'}\n*Collection:* ${data.collectionType} (${data.quantity})\n*Photos:* ${data.imageCount}\n*ID:* ${data.submissionId}`,
        }),
      })
      return { sent: true, channel: 'webhook' }
    } catch (err) {
      console.error('[LEAD ALERT ERROR] Failed to dispatch lead webhook:', err)
    }
  }

  // 2. Email Notification Hook (e.g. Resend, Postmark, AWS SES)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Sell Your Stamps Alerts <notifications@${BUSINESS_CONFIG.domain}>`,
          to: alertDestination,
          subject: `New Stamp Valuation Lead: £${data.estimatedValuation.toFixed(2)} - ${data.fullName} (${data.preferredContact || 'Phone Call'})`,
          html: `
            <h2>New Stamp Valuation Submission</h2>
            <p><strong>Lead ID:</strong> ${data.submissionId}</p>
            <p><strong>Customer:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Preferred Contact:</strong> ${data.preferredContact || 'Phone Call'}</p>
            <p><strong>Selling Pathway:</strong> ${data.sellingOption || 'Box & Send'}</p>
            <p><strong>Postcode:</strong> ${data.postcode}</p>
            <hr />
            <p><strong>Collection Type:</strong> ${data.collectionType}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            <p><strong>Era:</strong> ${data.era}</p>
            <p><strong>Est. Valuation:</strong> £${data.estimatedValuation.toFixed(2)}</p>
            <p><strong>Details:</strong><br />${data.description.replace(/\n/g, '<br />')}</p>
            <p><strong>Photos Uploaded:</strong> ${data.imageCount}</p>
          `,
        }),
      })
      if (res.ok) {
        return { sent: true, channel: 'email' }
      }
    } catch (err) {
      console.error('[LEAD ALERT ERROR] Failed to send email via Resend:', err)
    }
  }

  // 3. Fallback: Logged to system audit trail
  return { sent: false, channel: 'log_only' }
}

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
      return { sent: true, channel: 'webhook' }
    } catch (err) {
      console.error('[LEAD ALERT ERROR] Failed to dispatch contact webhook:', err)
    }
  }

  return { sent: false, channel: 'log_only' }
}
