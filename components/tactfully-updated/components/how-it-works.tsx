const steps = [
  {
    n: "01",
    title: "Paste or open a client message",
    body: "Bring in the conversation from support, sales, or success tools you already use.",
  },
  {
    n: "02",
    title: "Choose a tone and generate reply options",
    body: "Pick the right voice for the moment and get multiple ready-to-edit drafts.",
  },
  {
    n: "03",
    title: "Review sentiment signals and refine",
    body: "See how the thread is trending and adjust phrasing before anything is sent.",
  },
  {
    n: "04",
    title: "Send the final message with confidence",
    body: "Ship a consistent, on-brand response your whole team can stand behind.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">How it works</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Simple workflow, minimal friction.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-card p-6">
              <span className="font-mono text-sm font-semibold text-primary">{s.n}</span>
              <h3 className="mt-3 text-base font-semibold text-balance">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
