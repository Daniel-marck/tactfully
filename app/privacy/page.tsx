export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 24, 2026</p>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">When you create an account, we collect your email address and authentication data through Supabase. When you draft a reply, we store the message you provide, the situation and tone you select, and the generated reply so you can access your draft history.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How we use it</h2>
          <p className="mt-2">Your message content is sent to Google's Gemini API to generate drafts. We use account data to authenticate you and enforce free-tier limits. We do not sell your data.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Payments</h2>
          <p className="mt-2">Paid billing is currently disabled. Tactfully does not currently collect payment card or PayPal account details, and no payment processor is active for Pro purchases. This section will be updated before paid billing is introduced.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Service providers</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Supabase — authentication and database storage</li>
            <li>Google Gemini API — AI draft generation</li>
            <li>Vercel — application hosting</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your choices and contact</h2>
          <p className="mt-2">To request access, correction, or deletion of your account data, contact <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
