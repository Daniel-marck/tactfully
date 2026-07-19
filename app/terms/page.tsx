export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 19, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">The service</h2>
          <p className="mt-2">
            Tactfully helps you draft professional replies to client messages using AI.
            The Free plan includes 3 drafts. The Pro plan ($12/month) removes that
            limit. We may change these limits or pricing in the future, and we'll do
            our best to give notice before we do.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Your responsibility for generated content</h2>
          <p className="mt-2">
            Tactfully generates draft text using AI. You are responsible for reviewing
            every draft before sending it to a client -- we don't guarantee accuracy,
            tone, or appropriateness for your specific situation, and we're not liable
            for how you choose to use generated replies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Payments and refunds</h2>
          <p className="mt-2">
            Pro subscriptions are billed through PayPal. If you believe you were
            charged in error, contact us at{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">
              daniellutagwa34@gmail.com
            </a>{" "}
            and we'll look into it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-2">
            Don't use Tactfully to generate abusive, deceptive, or illegal content, or
            to attempt to disrupt or gain unauthorized access to our systems.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Account termination</h2>
          <p className="mt-2">
            You can stop using Tactfully and delete your account at any time. We may
            suspend accounts that violate these terms or abuse the free tier limits
            through automated means.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Changes</h2>
          <p className="mt-2">
            We may update these terms as the product evolves. Continued use of
            Tactfully after a change means you accept the updated terms.
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
