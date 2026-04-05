import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UK Stamp Valuations collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-10">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="prose prose-slate max-w-none space-y-6 text-foreground/90">
            <p>
              This policy describes how <strong>UK Stamp Valuations</strong> handles information you provide when you use
              our website, contact forms, and valuation services. It is a general template—replace with your final legal
              text and your ICO registration details where required.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Information we collect</h2>
            <p>
              We may collect details you submit voluntarily (name, email, phone, postcode, collection descriptions,
              uploads) and standard technical data such as IP address and browser type when you browse the site.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">How we use your information</h2>
            <p>
              We use this information to respond to enquiries, provide valuations, improve our services, and meet legal
              obligations. We do not sell your personal data.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Cookies</h2>
            <p>
              We may use essential and analytics cookies. You can control cookies through your browser settings.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Your rights</h2>
            <p>
              Under UK GDPR you may have rights to access, correct, or delete your personal data, and to object to or
              restrict certain processing. Contact us to exercise these rights.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Contact</h2>
            <p>
              Questions about this policy:{" "}
              <Link href="/contact" className="text-forest-green font-semibold hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
