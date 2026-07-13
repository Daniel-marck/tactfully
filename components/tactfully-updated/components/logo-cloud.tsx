const companies = ["Northwind", "Lumen", "Parallel", "Everly", "Cobalt", "Meridian"]

export function LogoCloud() {
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by teams that rely on fast, consistent communication
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {companies.map((name) => (
            <span key={name} className="text-lg font-semibold tracking-tight text-muted-foreground/70">
              {name}
            </span>
          ))}
        </div>
        <p className="mt-7 text-center text-sm text-muted-foreground">
          Reduce response time, improve message quality, and keep every client conversation aligned.
        </p>
      </div>
    </section>
  )
}
