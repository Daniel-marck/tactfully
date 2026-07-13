"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Is Tactfully only for support teams?",
    a: "No. It is designed for any team that needs faster, better client communication, including support, sales, and client success.",
  },
  {
    q: "What's included in Free?",
    a: "Free includes 3 AI replies per day, 3 reply tones, 2 reply options, copy response, and basic sentiment detection.",
  },
  {
    q: "What does Pro unlock?",
    a: "Pro unlocks unlimited replies, no daily limits, advanced negotiation, and a personal AI communication coach.",
  },
  {
    q: "Does Tactfully replace my team?",
    a: "No. It helps teams draft, refine, and manage communication more efficiently.",
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
