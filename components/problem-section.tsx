import { Clock, ShieldAlert, MessageSquareText } from "lucide-react"

const painPoints = [
  { icon: Clock, title: "You spend too long wording a difficult reply", body: "A short client message can take 30 minutes when the stakes involve money, deadlines, or a working relationship." },
  { icon: ShieldAlert, title: "You risk agreeing to something unclear", body: "A rushed response can accidentally accept extra work, a discount, or a deadline you never intended to commit to." },
  { icon: MessageSquareText, title: "You need more than a polished sentence", body: "The hard part is deciding what to say, what to clarify, and which boundary needs to stay intact." },
]

export function ProblemSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">The problem</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            One difficult client message can put a project off balance.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Independent professionals manage scope, deadlines, money, and relationships in the same inbox. The right reply needs judgment as well as good writing.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {painPoints.map((point) => (
            <div key={point.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <point.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
