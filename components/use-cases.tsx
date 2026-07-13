import { Headset, TrendingUp, Workflow } from "lucide-react"

const useCases = [
  {
    icon: Headset,
    audience: "Support teams",
    body: "Resolve requests faster with consistent, sentiment-aware replies.",
  },
  {
    icon: TrendingUp,
    audience: "Sales teams",
    body: "Improve follow-up messaging and strengthen negotiation language.",
  },
  {
    icon: Workflow,
    audience: "Operations teams",
    body: "Standardize communication across high-volume client interactions.",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">Use cases</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Built for teams that communicate with clients every day.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {useCases.map((u) => (
            <div key={u.audience} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <u.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{u.audience}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
