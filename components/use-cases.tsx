import { Wallet, Layers3, CalendarClock } from "lucide-react"

const useCases = [
  { icon: Wallet, audience: "Late or unclear payments", body: "Follow up on an overdue invoice without sounding hostile or accidentally weakening your payment terms." },
  { icon: Layers3, audience: "Scope creep and extra work", body: "Respond when a client adds deliverables, requests revisions, or assumes extra work is included." },
  { icon: CalendarClock, audience: "Deadlines and expectations", body: "Clarify timelines, manage last-minute requests, and reset expectations while keeping the relationship professional." },
]

export function UseCases() {
  return (
    <section id="use-cases" className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">Common client situations</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Built around the conversations freelancers actually face.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {useCases.map((item) => (
            <div key={item.audience} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{item.audience}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
