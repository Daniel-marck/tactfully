import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// Drop your Gumroad product checkout link in here once it's live.
// e.g. "https://gumroad.com/l/tactfully-pro"
const GUMROAD_PRO_CHECKOUT_URL = "https://smartoolkit.gumroad.com/l/dzlkij"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Everything you need to try Tactfully in real conversations.",
    features: [
      "3 AI replies/day",
      "3 reply tones",
      "2 reply options",
      "Copy response",
      "Basic client sentiment detection",
    ],
    cta: "Start Free",
    href: "/sign-up",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Unlimited scale plus advanced negotiation and coaching.",
    features: [
      "Unlimited AI replies",
      "No daily limits",
      "Advanced negotiation",
      "Personal AI communication coach",
    ],
    cta: "Upgrade to Pro",
    href: GUMROAD_PRO_CHECKOUT_URL,
    featured: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">Pricing</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Start free, upgrade when you need scale.
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                "flex flex-col rounded-2xl border p-8 " +
                (plan.featured
                  ? "border-primary bg-card shadow-lg shadow-primary/10 ring-1 ring-primary"
                  : "border-border bg-card")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    Most popular
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "default" : "outline"}
                className="mt-8 h-11 w-full text-sm"
                nativeButton={false}
                render={<a href={plan.href} target={plan.featured ? "_blank" : undefined} rel={plan.featured ? "noopener noreferrer" : undefined} />}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
