import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Sell Your Stamps UK website and services.",
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-sm mb-10">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="prose prose-slate max-w-none space-y-6 text-foreground/90">
            <p>
              These terms govern your use of the <strong>Sell Your Stamps UK</strong> website and related services. This
              is a general template—have it reviewed by a solicitor before publication.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Use of the site</h2>
            <p>
              You agree to use the site lawfully. Online estimates and calculators are indicative only and do not
              constitute a binding offer until confirmed by us after inspection or appraisal.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Intellectual property</h2>
            <p>
              Content on this site (text, design, logos) is owned by Sell Your Stamps UK or its licensors unless
              otherwise stated. You may not copy or reuse it without permission.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Limitation of liability</h2>
            <p>
              We aim to keep information accurate but do not guarantee completeness. To the extent permitted by law, we
              limit liability arising from use of the site or reliance on any estimate shown online.
            </p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Changes</h2>
            <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance.</p>
            <h2 className="font-serif text-xl font-semibold text-primary mt-10">Contact</h2>
            <p>
              For questions about these terms:{" "}
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
