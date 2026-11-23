export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 24, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">
            When you create an account, Supabase processes your email address and
            password. We do not receive or store your raw password. When you draft a
            reply, we store the client message you paste, the situation and tone you
            select, your desired outcome, any constraints you ask us to avoid, and the
            reply options generated. These details are saved in your private draft
            history so you can review, edit, and delete them.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">How we use your information</h2>
          <p className="mt-2">
            Your message and drafting context are sent to Google's Gemini API to
            generate reply suggestions. We use account and usage information to
            authenticate you, protect saved drafts, and enforce the free allowance of
            three generations per day. Each successful generation returns three
            response strategies. We do not sell your messages or use them to train a
            Tactfully-owned AI model.
          </p>
          <p className="mt-2">
            Google's handling of prompts and responses depends on the Gemini API
            account tier and applicable terms. Google states that free-tier content
            may be used to improve its products, while paid-tier content is not used
            for that purpose. Do not paste confidential, regulated, or sensitive
            client information unless you have confirmed that the provider terms and
            account tier are appropriate for that information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Storage and security</h2>
          <p className="mt-2">
            Account and draft data are stored with Supabase. Row-level security
            restricts profile and draft access to the signed-in account that owns the
            records. We use Vercel to host the application. No security measure is
            perfect, so avoid submitting information you are not authorized to share.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Payments</h2>
          <p className="mt-2">
            Tactfully is not currently accepting payments. Pro subscriptions are
            planned but checkout is disabled. If paid subscriptions are introduced,
            this policy will be updated to identify the payment provider and explain
            the information processed for billing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Your choices and deletion</h2>
          <p className="mt-2">
            You can delete individual saved drafts from your dashboard. To request
            deletion of your account and associated profile and draft data, contact
            us at{" "}
            <a href="mailto:daniellutagwa34@gmail.com" className="text-foreground underline">
              daniellutagwa34@gmail.com
            </a>
            . We will process account-deletion requests within a reasonable period,
            subject to any legal or operational retention requirements.
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
