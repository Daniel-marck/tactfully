export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 22, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">Information we collect</h2>
          <p className="mt-2">
            We collect your email address and account information when you register. When you use Tactfully, we store the client message you submit, optional project context, your selected situation and tone, the AI analysis, and the reply drafts so you can review and manage your conversation history.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How information is used</h2>
          <p className="mt-2">
            We use account information to provide authentication, save your conversations, and enforce the daily free usage allowance. The client message and project context you submit are sent to Google's Gemini API to generate the analysis and reply suggestions. Do not submit passwords, payment details, confidential client secrets, or information you are not authorized to share with the service and its AI provider.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Service providers</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Supabase — account authentication and database storage</li>
            <li>Google Gemini API — AI analysis and reply generation</li>
            <li>Vercel — application hosting and analytics</li>
          </ul>
          <p className="mt-2">
            Each provider processes information under its own terms and privacy documentation. Review those terms before submitting sensitive or confidential material.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Payments</h2>
          <p className="mt-2">
            Tactfully is currently offered in free early access. Paid subscriptions and checkout are not available, and we do not collect payment card or PayPal details through the product.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Retention and your choices</h2>
          <p className="mt-2">
            Saved conversations remain in your account until you delete them or request account deletion. You can delete individual saved conversations in the dashboard. To request deletion of your account and associated records, contact us at{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Email{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">daniellutagwa34@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
