const steps = [
  { n: "01", title: "Paste the client message", body: "Add the message that is difficult to answer. Include only the project context needed to understand it." },
  { n: "02", title: "Review the situation", body: "Tactfully summarizes the likely intent, identifies practical risks, and highlights a boundary to protect." },
  { n: "03", title: "Compare two approaches", body: "See a collaborative option and a more direct alternative, with guidance on when each may fit." },
  { n: "04", title: "Edit, copy, and save", body: "You stay in control. Refine the draft, copy it into your own channel, and keep the conversation in your private history." },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">How it works</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            From uncertainty to a considered reply.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="rounded-xl border border-border bg-card p-6">
              <span className="font-mono text-sm font-semibold text-primary">{step.n}</span>
              <h3 className="mt-3 text-base font-semibold text-balance">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
