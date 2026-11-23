export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 24, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">The service and current limits</h2>
          <p className="mt-2">
            Tactfully helps you draft professional replies to client messages using
            AI. The current Free plan includes three generations per day. Each
            generation provides up to three different response strategies. Pro is
            planned at $12 USD per month, but subscriptions are not available and no
            payments are currently being accepted. We will publish updated terms
            before introducing paid subscriptions or changing material limits.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Your responsibility for generated content</h2>
          <p className="mt-2">
            Tactfully generates draft text using AI. You must review and verify every
            draft before sending it to a client. Generated text may be inaccurate,
            incomplete, or unsuitable for your situation. You are responsible for
            checking factual claims, commitments, deadlines, pricing, legal terms,
            and tone before using a reply.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Payments and refunds</h2>
          <p className="mt-2">
            Tactfully is not currently accepting payments. Pro subscriptions are not
            available, and no payment is required to use the current Free plan. When
            recurring checkout is introduced, the checkout screen and updated terms
            will explain the price, renewal schedule, cancellation process, and
            applicable refund terms before payment is accepted. Do not send payment
            outside an official Tactfully checkout. For billing questions, contact
            us at{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">
              daniellutagwa34@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-2">
            Do not use Tactfully to generate abusive, deceptive, or illegal content,
            or to attempt to disrupt or gain unauthorized access to our systems. You
            must have the right to submit any client message or information you paste
            into the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Account termination and saved drafts</h2>
          <p className="mt-2">
            You can stop using Tactfully and delete individual saved drafts from your
            dashboard. To request account deletion, contact us using the address
            below. We may suspend accounts that violate these terms or attempt to
            abuse usage limits through automated means.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Changes</h2>
          <p className="mt-2">
            We may update these terms as the product evolves. We will update the
            revision date when material changes are made. Continued use after an
            updated version takes effect means you accept the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions? Email{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">
              daniellutagwa34@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
