import { Check } from "lucide-react"

const features = [
  "3 message analyses per day",
  "Two distinct reply approaches",
  "Situation and risk analysis",
  "Copy and save your replies",
  "Private conversation history",
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">Early access</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Start with the complete core workflow.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Tactfully is free to use while we validate the product with independent professionals. Paid plans will be introduced only after recurring billing and account management are ready.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-primary bg-card p-8 shadow-lg shadow-primary/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Early access</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Available now</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">$0</span>
            <span className="text-sm text-muted-foreground">during early access</span>
          </div>
          <ul className="mt-6 flex flex-col gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <a href="/sign-up" className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Create your free account
          </a>
        </div>
      </div>
    </section>
  )
}
