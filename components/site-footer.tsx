import { MessagesSquare } from "lucide-react"

const columns = [
  { title: "Product", links: [
    { label: "Pricing", href: "#pricing" },
    { label: "Use cases", href: "#use-cases" },
  ]},
  { title: "Company", links: [
    { label: "Contact", href: "mailto:daniellutagwa34@gmail.com" },
  ]},
]

export function SiteFooter() {
  return (
    <footer className="bg-card">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(2,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessagesSquare className="size-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight">Tactfully</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Client communication intelligence for support and revenue teams.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Tactfully. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
