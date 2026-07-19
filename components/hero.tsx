import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const bullets = [
  "3 AI replies/day on Free",
  "Unlimited replies on Pro",
  "Basic sentiment detection included",
  "Advanced negotiation support in Pro",
]

function SealIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path
        d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z"
        fill="#F5EFE1"
        opacity="0.9"
      />
    </svg>
  )
}

function Postmark() {
  return (
    <div
      className="absolute -top-3 -right-2 w-12 h-12 rounded-full flex flex-col items-center justify-center rotate-[8deg] select-none"
      style={{
        border: '1.5px solid rgba(184,114,42,0.55)',
        background: 'rgba(245,239,225,0.9)',
        boxShadow: '0 4px 10px rgba(27,42,58,0.15)',
      }}
    >
      <span
        className="uppercase leading-none"
        style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 5.5, letterSpacing: '0.1em', color: '#B8722A' }}
      >
        Tactfully
      </span>
      <span
        className="leading-none mt-0.5"
        style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 7, color: '#1B2A3A' }}
      >
        Jul 19
      </span>
    </div>
  )
}

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

      <div className="flex flex-col gap-3 mt-4">
        <div
          className="relative rounded-md p-5 shadow-xl"
          style={{ background: '#F5EFE1', color: '#24303B' }}
        >
          <div
            className="absolute -top-3 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle at 32% 30%, #D98A3B, #B8722A 60%, #8a541f 100%)', boxShadow: '0 4px 10px rgba(0,0,0,0.35)' }}
          >
            <SealIcon />
          </div>
          <Postmark />
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

        <div
          className="relative rounded-md p-5 shadow-xl"
          style={{ background: '#F5EFE1', color: '#24303B' }}
        >
          <span
            className="block mb-2"
            style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 13, color: '#B8722A' }}
          >
            Option 2
          </span>
          <p className="text-[12.5px] leading-relaxed" style={{ fontFamily: "var(--font-work-sans), sans-serif" }}>
            I appreciate you flagging that -- happy to walk through what's driving the price so it's clear where the value is...
          </p>
        </div>
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
