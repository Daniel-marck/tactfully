export function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl">
              Make your next difficult client reply a considered one.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-primary-foreground/80">
              Understand the message, protect what matters, and choose how you want to respond. You remain in control of every message.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/sign-up" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-secondary px-6 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                Create your free account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
