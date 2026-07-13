import { Button } from "@/components/ui/button"

// Keep in sync with the Pro checkout link in pricing-section.tsx.
const GUMROAD_PRO_CHECKOUT_URL = "https://smartoolkit.gumroad.com/l/dzlkij"

export function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl">
              Standardize client communication at scale.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-primary-foreground/80">
              Give your team a smarter way to respond, negotiate, and improve every client conversation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" className="h-11 px-6 text-sm" nativeButton={false} render={<a href="/sign-up" />}>
                Start Free
              </Button>
              <Button
                variant="outline"
                className="h-11 border-primary-foreground/30 bg-transparent px-6 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                nativeButton={false}
                render={<a href={GUMROAD_PRO_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" />}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
