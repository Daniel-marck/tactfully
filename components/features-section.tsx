import { BrainCircuit, ShieldCheck, MessagesSquare, Archive } from "lucide-react"

const features = [
  { icon: BrainCircuit, title: "Understand the message before replying", body: "Get a concise read of what the client appears to need, with uncertainty called out instead of guessed.", tag: "Message analysis" },
  { icon: ShieldCheck, title: "See the commercial risk", body: "Surface signals such as scope creep, delayed payment, discount pressure, or unclear expectations.", tag: "Risk flags" },
  { icon: MessagesSquare, title: "Choose a response strategy", body: "Compare two distinct approaches, understand when each is useful, and edit the wording before sending.", tag: "Strategic replies" },
  { icon: Archive, title: "Keep a private record", body: "Save the incoming message, analysis, and reply options so you can return to the conversation later.", tag: "Conversation history" },
]

export function FeaturesSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">The core workflow</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Better decisions, not just different wording.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Tactfully helps you understand the conversation, protect the important boundary, and choose how to respond.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <span className="mt-4 text-xs font-medium text-primary">{feature.tag}</span>
              <h3 className="mt-1 text-lg font-semibold text-balance">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
