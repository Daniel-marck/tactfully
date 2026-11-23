import { Check } from "lucide-react"

const freeFeatures = [
  "3 AI replies per day",
  "3 reply tones",
  "2 reply options per message",
  "Copy and edit your response",
  "Basic client sentiment detection",
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">Pricing</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Try Tactfully free. Paid plans are coming later.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The free plan is available now. Pro checkout is disabled while we prepare secure recurring billing.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <h3 className="text-lg font-semibold">Free</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">$0</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Explore the core client-reply workflow at no cost.</p>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <a href="/sign-up" className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Start free
            </a>
          </div>
          <div className="flex flex-col rounded-2xl border border-border bg-muted/30 p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Pro</h3>
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">Coming later</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-semibold tracking-tight">Not available yet</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              We're preparing recurring billing and will publish the final price and plan details before launch.
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
              <li>• Pro access is not currently sold</li>
              <li>• No payment details are requested</li>
              <li>• No subscription or recurring charge is active</li>
            </ul>
            <span aria-disabled="true" className="mt-8 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-muted-foreground">
              Pro checkout unavailable
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
