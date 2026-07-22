import { ArrowRight, PenLine, ListChecks, RefreshCw } from "lucide-react"

const flow = [
  { icon: PenLine, label: "Write", note: "Two AI-drafted options" },
  { icon: ListChecks, label: "Review", note: "Tone + situation control" },
  { icon: RefreshCw, label: "Reuse", note: "Every letter filed for later" },
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

function DashboardPreview() {
  const filedLetters = [
    { label: 'Lowball offer', snippet: 'Hey, can you just knock the price down...' },
    { label: 'Late payment', snippet: 'Following up on the invoice from...' },
    { label: 'Scope creep', snippet: 'Can you also add a few extra pages...' },
  ]

  return (
    <div className="p-6" style={{ background: '#1B2A3A' }}>
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="hidden sm:flex flex-col gap-2">
          <span
            className="uppercase mb-1"
            style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 9, letterSpacing: '0.1em', color: '#B8C2CE' }}
          >
            Filed letters
          </span>
          {filedLetters.map((item) => (
            <div key={item.label} className="rounded-md px-3 py-2" style={{ background: 'rgba(245,239,225,0.06)' }}>
              <span
                className="block uppercase mb-0.5"
                style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 8, letterSpacing: '0.08em', color: '#B8722A' }}
              >
                {item.label}
              </span>
              <span className="block text-[10.5px] truncate" style={{ color: '#F5EFE1', fontFamily: "var(--font-work-sans), sans-serif" }}>
                {item.snippet}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
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
    </div>
  )
}

export function SolutionSection() {
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-24">
        <div>
          <span className="text-sm font-semibold text-primary">The solution</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tactfully gives your team a better communication workflow.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Paste in the client message, pick a situation and a tone, and Tactfully drafts two distinct reply options --
            each taking a genuinely different approach. Every letter you draft is automatically filed, so you can
            revisit and reuse it later.
          </p>
          <p className="mt-4 rounded-lg border-l-2 border-primary bg-primary/[0.04] px-4 py-3 text-sm font-medium text-foreground">
            Replace fragmented drafting with a repeatable response process.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {flow.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center gap-3 sm:flex-col sm:text-center">
                <div className="flex flex-1 flex-col items-center gap-3 rounded-xl border border-border bg-background p-5 sm:w-full">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{step.label}</div>
                    <div className="text-xs text-muted-foreground">{step.note}</div>
                  </div>
                </div>
                {i < flow.length - 1 && (
                  <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground sm:rotate-0" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            One structured workspace instead of scattered tools and copy-paste.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Every letter, filed and ready to reuse.
          </h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            Your past drafts are saved automatically -- pull one up, reuse it, or start fresh.
          </p>
        </div>
        <div className="relative mt-10">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="ml-3 text-xs font-medium text-muted-foreground">app.tactfully.com/dashboard</span>
            </div>
            <DashboardPreview />
          </div>
          <div className="pointer-events-none absolute -bottom-8 left-1/2 -z-10 h-40 w-3/4 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
