"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Who is Tactfully for?",
    a: "Tactfully is for freelancers and client-facing teams who want help drafting clear, professional replies to customer or client messages.",
  },
  {
    q: "What's included in Free?",
    a: "Free currently includes 3 AI replies per day, 3 reply tones, 2 reply options, copy response, and basic sentiment detection.",
  },
  {
    q: "Can I subscribe to Pro now?",
    a: "No. Pro checkout is temporarily disabled while recurring billing is prepared. No payment should be made for Pro. We will publish the price, renewal, cancellation, and refund terms before paid plans open.",
  },
  {
    q: "Does Tactfully send messages automatically?",
    a: "No. Tactfully generates drafts for you to review, edit, and send yourself. You remain responsible for checking each reply.",
  },
  {
    q: "What happens to the messages I paste in?",
    a: "Message content is processed to generate your draft and may be stored in your draft history. Review the Privacy Policy for details about data handling and service providers.",
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
                  <ChevronDown className={"size-5 shrink-0 text-muted-foreground transition-transform " + (isOpen ? "rotate-180" : "")} />
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
