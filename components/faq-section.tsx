"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Who is Tactfully built for?",
    a: "Tactfully is built first for freelancers and independent consultants who manage client relationships, project scope, deadlines, and payments themselves.",
  },
  {
    q: "What can I do with Tactfully?",
    a: "You can analyze up to three client messages per day, see practical risk flags and a recommended strategy, generate two different reply approaches, and save your conversation history.",
  },
  {
    q: "Are paid plans available?",
    a: "Not yet. Tactfully is in early access. Paid plans will launch after recurring billing, renewals, cancellations, and account controls have been implemented and tested.",
  },
  {
    q: "Does Tactfully send messages for me?",
    a: "No. Tactfully analyzes and drafts suggestions. You decide what to edit, copy, and send.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <span className="text-sm font-semibold text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Answers before you get started.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-card">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium">{item.q}</span>
                  <ChevronDown
                    className={
                      "size-5 shrink-0 text-muted-foreground transition-transform " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
