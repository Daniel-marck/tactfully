export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 19, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">
            When you create an account, we collect your email address and password
            (stored securely and encrypted by our authentication provider, Supabase --
            we never see your raw password). When you use Tactfully to draft a reply,
            we store the client message you paste in, the situation and tone you
            select, and the reply Tactfully generates, so you can find them again
            later in your "Filed letters" history.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">How we use it</h2>
          <p className="mt-2">
            Your pasted messages are sent to Google's Gemini API to generate reply
            drafts. We use your account data to enforce our free-tier usage limit and
            to know whether you've upgraded to Pro. We do not sell your data, and we
            do not use your messages to train any AI model.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Payments</h2>
          <p className="mt-2">
            When you upgrade to Pro, your payment is processed directly by PayPal. We
            never see or store your card or PayPal account details -- our server only
            receives confirmation from PayPal that a payment completed, which we use
            to unlock Pro features on your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Third parties we rely on</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Supabase -- authentication and database storage</li>
            <li>Google (Gemini API) -- generating your draft replies</li>
            <li>PayPal -- processing Pro subscription payments</li>
            <li>Vercel -- hosting this application</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Your choices</h2>
          <p className="mt-2">
            You can delete your account and associated data at any time by contacting
            us at{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">
              daniellutagwa34@gmail.com
            </a>
            . We'll remove your profile, drafts, and account within a reasonable time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Email{" "}
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
