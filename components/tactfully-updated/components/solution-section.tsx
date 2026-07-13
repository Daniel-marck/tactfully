import Image from "next/image"
import { ArrowRight, PenLine, ListChecks, RefreshCw } from "lucide-react"

const flow = [
  { icon: PenLine, label: "Write", note: "AI reply generation" },
  { icon: ListChecks, label: "Review", note: "Tone + sentiment" },
  { icon: RefreshCw, label: "Improve", note: "Repeatable process" },
]

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
            Tactfully combines AI reply generation, tone selection, sentiment detection, and negotiation support in one
            workspace. Instead of moving between drafting tools and guesswork, your team gets a structured way to write,
            review, and improve replies.
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
            See every client conversation at a glance.
          </h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            Track sentiment, response time, and at-risk threads across your whole team from one dashboard.
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
            <Image
              src="/images/product-sentiment.png"
              alt="Tactfully dashboard showing conversation totals, sentiment breakdown, average response time trend, and recent client conversations"
              width={1024}
              height={1024}
              className="h-auto w-full"
            />
          </div>
          <div className="pointer-events-none absolute -bottom-8 left-1/2 -z-10 h-40 w-3/4 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
