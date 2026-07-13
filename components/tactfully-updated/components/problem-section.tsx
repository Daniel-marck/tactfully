import { Clock, Waves, ShieldAlert } from "lucide-react"

const painPoints = [
  {
    icon: Clock,
    title: "Replies take too long to draft",
    body: "Agents rewrite the same responses from scratch, slowing down every conversation and burning capacity.",
  },
  {
    icon: Waves,
    title: "Tone varies between team members",
    body: "Without a shared standard, one thread reads warm and helpful while the next feels cold or off-brand.",
  },
  {
    icon: ShieldAlert,
    title: "Risky conversations aren't flagged early",
    body: "Frustration and churn signals slip through until it's too late to change the outcome.",
  },
]

export function ProblemSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">The problem</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Client communication breaks down when every reply is manual.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Support and revenue teams lose time drafting from scratch, struggle to keep tone consistent, and miss
            sentiment signals that could change the outcome of a conversation. When volume grows, quality often drops.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {painPoints.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
