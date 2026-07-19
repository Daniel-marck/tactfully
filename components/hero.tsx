import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const bullets = [
  "3 AI replies/day on Free",
  "Unlimited replies on Pro",
  "Basic sentiment detection included",
  "Advanced negotiation support in Pro",
]

function ProductPreview() {
  return (
    <div className="p-6" style={{ background: '#1B2A3A' }}>
      <div
        className="relative rounded-md p-5 shadow-xl"
        style={{ background: '#F5EFE1', color: '#24303B', transform: 'rotate(-0.4deg)' }}
      >
        <div
          className="absolute -top-2 left-5 w-9 h-4 -rotate-3"
          style={{ background: 'rgba(184,114,42,0.35)', border: '1px solid rgba(184,114,42,0.5)' }}
        />
        <span
          className="block mb-2.5 uppercase"
          style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 9, letterSpacing: '0.12em', color: '#B8722A' }}
        >
          The message
        </span>
        <p className="text-[13px] mb-4" style={{ fontFamily: "var(--font-work-sans), sans-serif", color: '#24303B' }}>
          "Hey, can you just knock the price down a bit? Thought this was cheaper..."
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {['Lowball offer', 'Diplomatic'].map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-1 text-[11px]"
              style={{ background: '#1B2A3A', color: '#F5EFE1' }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className="w-full py-2 rounded-md text-center text-[12px] font-semibold"
          style={{ background: '#B8722A', color: '#fff', fontFamily: "var(--font-work-sans), sans-serif" }}
        >
          Draft my reply
        </div>
      </div>

      <div
        className="relative rounded-md p-5 shadow-xl mt-4"
        style={{ background: '#F5EFE1', color: '#24303B' }}
      >
        <div
          className="absolute -top-3 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 32% 30%, #D98A3B, #B8722A 60%, #8a541f 100%)' }}
        />
        <span
          className="block mb-2"
          style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 13, color: '#B8722A' }}
        >
          Option 1
        </span>
        <p className="text-[12.5px] leading-relaxed" style={{ fontFamily: "var(--font-work-sans), sans-serif" }}>
          Thanks for reaching out! Our current rate reflects the scope we discussed -- happy to revisit if the project shrinks in scope...
        </p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(65%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI communication platform for client-facing teams
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            Client communication intelligence for support and revenue teams.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Generate better replies, detect sentiment, and optimize negotiation workflows with AI that helps your team
            respond faster and close more effectively.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 px-6 text-sm" nativeButton={false} render={<a href="#pricing" />}>
              Start Free
            </Button>
            <Button variant="outline" className="h-11 px-6 text-sm" nativeButton={false} render={<a href="#pricing" />}>
              Upgrade to Pro
            </Button>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="ml-3 text-xs font-medium text-muted-foreground">app.tactfully.com</span>
            </div>
            <ProductPreview />
          </div>
          <div className="pointer-events-none absolute -right-6 -top-6 -z-10 size-44 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 -z-10 size-44 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
