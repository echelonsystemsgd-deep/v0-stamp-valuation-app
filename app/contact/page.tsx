import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/forms/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { contactInfo } from '@/data/navigation'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with UK Stamp Valuations. Contact us for stamp valuations, selling enquiries, or general questions.',
}

const contactDetails = [
  {
    icon: MapPin,
    label: 'Address',
    value: contactInfo.address,
    href: null,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
  },
  {
    icon: Mail,
    label: 'Email',
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
  },
  {
    icon: Clock,
    label: 'Hours',
    value: contactInfo.hours,
    href: null,
  },
]

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="bg-oxford-blue py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-white">Contact Us</h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                Have questions about selling your stamps or need more information? 
                We&apos;d love to hear from you. Get in touch using any of the methods below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-primary mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Our team is available Monday to Friday to answer your questions 
                  and provide guidance on selling your stamp collection.
                </p>

                <div className="flex flex-col gap-6">
                  {contactDetails.map((detail) => (
                    <Card key={detail.label}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center shrink-0">
                          <detail.icon className="w-5 h-5 text-forest-green" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="text-primary font-medium hover:text-forest-green transition-colors break-all"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <p className="text-primary font-medium">{detail.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-secondary rounded-lg">
                  <h3 className="font-serif text-lg font-semibold text-primary mb-3">
                    Need a Quick Response?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    For the fastest response, we recommend using our online valuation form. 
                    Our team typically responds within 48 hours.
                  </p>
                  <a
                    href="/sell-your-stamps"
                    className="text-forest-green font-medium hover:underline"
                  >
                    Submit a valuation request &rarr;
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-primary mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="py-16 lg:py-20 bg-secondary" aria-labelledby="location-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 id="location-heading" className="text-primary">Visit Our Office</h2>
              <p className="mt-4 text-muted-foreground">
                We welcome visits to our London office. Please contact us in advance to arrange an appointment.
              </p>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {contactInfo.address}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Appointments available Monday - Friday, 9am - 5pm
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
