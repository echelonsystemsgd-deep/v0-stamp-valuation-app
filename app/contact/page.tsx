import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/forms/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import { InlineSellCTA } from '@/components/sections/sell-cta'
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
              <h1 className="text-white text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">Contact Us</h1>
              <p className="mt-4 text-xl text-white/80 leading-relaxed font-medium">
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
                <p className="text-muted-foreground mb-8 text-lg">
                  Our team is available Monday to Friday to answer your questions 
                  and provide guidance on selling your stamp collection.
                </p>

                <div className="flex flex-col gap-5">
                  {contactDetails.map((detail) => (
                    <Card key={detail.label} className="border-border/50 hover:border-forest-green/30 transition-colors">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-forest-green/10 flex items-center justify-center shrink-0">
                          <detail.icon className="w-5 h-5 text-forest-green" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{detail.label}</p>
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="text-primary font-serif text-lg font-bold hover:text-forest-green transition-colors break-all"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <p className="text-primary font-serif text-lg font-bold">{detail.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-8 bg-forest-green/5 rounded-xl border border-forest-green/10">
                  <h3 className="font-serif text-xl font-bold text-primary mb-3">
                    Need a Quick Valuation?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    For the fastest service, use our specialized valuation form. It helps our experts provide a more accurate initial assessment.
                  </p>
                  <Link
                    href="/sell-your-stamps"
                    className="inline-flex items-center gap-2 text-forest-green font-bold text-lg hover:gap-3 transition-all"
                  >
                    Start your valuation now &rarr;
                  </Link>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-border/50">
                <h2 className="text-primary mb-6 font-serif font-black">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="py-16 lg:py-20 bg-secondary" aria-labelledby="location-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 id="location-heading" className="text-primary">Visit Our Office</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We welcome visits to our London office. Please contact us in advance to arrange an appointment.
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted flex items-center justify-center border border-border/50 shadow-inner group">
              <div className="text-center p-8 transition-transform group-hover:scale-105 duration-500">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <MapPin className="w-8 h-8 text-forest-green" />
                </div>
                <p className="text-primary font-serif font-bold text-xl mb-2">
                  {contactInfo.address}
                </p>
                <p className="text-muted-foreground">
                  Appointments available Monday - Friday, 9am - 5pm
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <InlineSellCTA 
              variant="simple"
              title="Not sure if your stamps are valuable?"
              description="Our expert valuation service is free and carries no obligation to sell. Join the thousands of collectors we've helped since 1998."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
