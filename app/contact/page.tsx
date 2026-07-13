import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/forms/contact-form'
import { InlineSellCTA } from '@/components/sections/sell-cta'
import { HeroSlideshow } from '@/components/ui/hero-slideshow'
import { contactUsHero } from '@/data/slideshows'
import { ContactDetailsList } from '@/components/content/contact-details-list'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sell Your Stamps UK. Contact us for stamp valuations, selling enquiries, or general questions.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full">
        <HeroSlideshow 
          images={contactUsHero}
          title="Contact Us"
          subtitle="Have questions about selling your stamps or need more information? We'd love to hear from you. Get in touch using any of the methods below."
        />

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

                <ContactDetailsList />

                {/* Additional Info */}
                <div className="mt-8 p-8 bg-forest-green/5 rounded-xl border border-forest-green/10">
                  <h3 className="font-serif text-xl font-bold text-primary mb-3">
                    Need a Quick Valuation?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    For the fastest service, use our specialised valuation form. It helps our experts provide a more accurate initial assessment.
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
