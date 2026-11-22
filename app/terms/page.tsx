export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 22, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">The service</h2>
          <p className="mt-2">
            Tactfully helps freelancers and independent consultants understand difficult client messages and prepare reply suggestions. The early-access version includes up to three successful message analyses per UTC calendar day. Paid subscriptions are not currently available.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">AI-generated content</h2>
          <p className="mt-2">
            Tactfully provides AI-generated analysis and draft wording for informational and communication support. Outputs may be incomplete or inaccurate and are not legal, financial, or contractual advice. You must review and edit every suggestion before deciding whether to send it. Tactfully does not send messages on your behalf and does not guarantee any client or commercial outcome.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your responsibilities</h2>
          <p className="mt-2">
            You are responsible for ensuring that you have the right to submit any client message or project information you provide. Do not submit information that you are not authorized to share. You remain responsible for all communications you choose to send.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-2">
            Do not use Tactfully to generate abusive, deceptive, unlawful, or harmful content, or to attempt to disrupt the service, bypass usage limits, or gain unauthorized access to accounts or systems.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Availability and changes</h2>
          <p className="mt-2">
            The service is provided during early access and may change as we improve it. We may suspend or discontinue features, update usage limits, or restrict accounts that abuse the service. We will make reasonable efforts to communicate material changes.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Account termination</h2>
          <p className="mt-2">
            You can stop using Tactfully at any time and request account deletion by contacting{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Email{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
