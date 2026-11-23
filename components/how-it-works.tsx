const steps = [
  {
    n: "01",
    title: "Paste the client message",
    body: "Copy the message or email you need to respond to and paste it into Tactfully.",
  },
  {
    n: "02",
    title: "Choose the situation and tone",
    body: "Set the context and choose the tone that best fits the conversation.",
  },
  {
    n: "03",
    title: "Generate and review two drafts",
    body: "Compare the two AI suggestions, check the wording, and edit anything that needs changing.",
  },
  {
    n: "04",
    title: "Copy and send it yourself",
    body: "Choose the version you want, copy it, and send it from your usual email or messaging app.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">How it works</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Simple workflow. You stay in control.
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
