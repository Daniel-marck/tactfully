export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 24, 2026</p>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">The service</h2>
          <p className="mt-2">Tactfully helps you draft professional replies to messages using AI. The Free plan currently includes 3 drafts. Paid Pro billing is not currently available, and no payment should be made to access Pro features. We will publish pricing and billing terms before paid plans launch.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your responsibility for generated content</h2>
          <p className="mt-2">Tactfully generates draft text using AI. You are responsible for reviewing every draft before sending it. We do not guarantee accuracy, tone, or appropriateness for your specific situation.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Payments and refunds</h2>
          <p className="mt-2">Paid billing is not enabled. Tactfully will not request or accept payment for Pro until a supported recurring billing process is implemented and the applicable pricing, renewal, cancellation, and refund terms are published.</p>
          <p className="mt-2">For questions, contact <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-2">Do not use Tactfully to generate abusive, deceptive, or illegal content, or to attempt to disrupt or gain unauthorized access to our systems.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Account termination</h2>
          <p className="mt-2">You can stop using Tactfully and request account deletion at any time by contacting us. We may suspend accounts that violate these terms or abuse free-tier limits.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Changes and contact</h2>
          <p className="mt-2">We may update these terms as the product evolves. Questions? Email <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
