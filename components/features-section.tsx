import { Wand2, SlidersHorizontal, Activity, Archive } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "Generate two reply options",
    body: "Turn one client message into two distinct AI-generated drafts you can compare, edit, and choose from.",
    tag: "AI reply drafting",
  },
  {
    icon: SlidersHorizontal,
    title: "Choose a tone for the situation",
    body: "Adjust the tone to suit the conversation, from warm and diplomatic to direct and professional.",
    tag: "Tone control",
  },
  {
    icon: Activity,
    title: "See a basic sentiment signal",
    body: "Get a simple indication of the message's emotional direction before deciding how to respond.",
    tag: "Sentiment insight",
  },
  {
    icon: Archive,
    title: "Keep your previous drafts organised",
    body: "Return to saved drafts, review earlier replies, and reuse useful wording when similar situations come up.",
    tag: "Draft history",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">Features</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A clearer workflow for everyday client replies.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Tactfully focuses on the practical steps: draft, compare, refine, and keep a record of your client communication.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col rounded-xl border border-border bg-card p-6">
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
