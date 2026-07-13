import { Wand2, SlidersHorizontal, Activity, Handshake, GraduationCap } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "Generate client-ready replies in seconds",
    body: "Create multiple response options from one message so teams can choose the best version before sending.",
    tag: "AI reply generation",
  },
  {
    icon: SlidersHorizontal,
    title: "Match the tone to the conversation",
    body: "Use different reply tones for support, escalation, sales follow-up, or negotiation contexts.",
    tag: "Tone control",
  },
  {
    icon: Activity,
    title: "Spot at-risk conversations earlier",
    body: "Surface basic sentiment signals so agents and managers can prioritize sensitive threads faster.",
    tag: "Sentiment detection",
  },
  {
    icon: Handshake,
    title: "Improve reply language for better outcomes",
    body: "Strengthen phrasing for retention, objection handling, and deal recovery with advanced negotiation tools in Pro.",
    tag: "Negotiation support",
  },
  {
    icon: GraduationCap,
    title: "Build better communication habits over time",
    body: "Give teams guidance that improves consistency, response quality, and confidence in difficult exchanges.",
    tag: "Communication coach",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">Features</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything your team needs to respond with confidence.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Each capability answers a distinct question, from drafting the first reply to coaching the whole team toward
            better outcomes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={
                "flex flex-col rounded-xl border border-border bg-card p-6" +
                (i === 0 ? " lg:col-span-2 lg:bg-primary/[0.03]" : "")
              }
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <span className="mt-4 text-xs font-medium text-primary">{f.tag}</span>
              <h3 className="mt-1 text-lg font-semibold text-balance">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
