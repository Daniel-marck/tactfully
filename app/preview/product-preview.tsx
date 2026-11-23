"use client"

import { useMemo, useState } from "react"
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react"
import styles from "./product-preview.module.css"

const drafts = [
  { name: "Alex Morgan", subject: "Scope expansion", preview: "Could we also add the landing page?", time: "12m", tone: "Warm", status: "New" },
  { name: "Sofia Kim", subject: "Invoice follow-up", preview: "Just checking whether the invoice has been…", time: "1h", tone: "Direct", status: "Replied" },
  { name: "Marcos Ruiz", subject: "Delivery timing", preview: "Is there any chance we can move the launch?", time: "Tue", tone: "Clear", status: "Draft" },
]

const scenarios = ["Scope change", "Late payment", "No response", "Unclear brief", "Say no"]
const tones = ["Warm", "Direct", "Candid", "Formal"]

export function ProductPreview() {
  const [selectedDraft, setSelectedDraft] = useState(0)
  const [scenario, setScenario] = useState("Scope change")
  const [tone, setTone] = useState("Warm")
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileDraft, setMobileDraft] = useState(false)

  const reply = useMemo(() => {
    const openings: Record<string, string> = {
      Warm: "Hi Alex,\n\nThanks for sharing this. I’d be happy to include the landing page, and I want to make sure we have the space to do it properly.",
      Direct: "Hi Alex,\n\nI can add the landing page. It sits outside our agreed scope, so I’ll need to confirm the added cost and adjusted timeline before starting.",
      Candid: "Hi Alex,\n\nThe landing page is possible, but I don’t think we can keep the existing launch date and quality level unchanged.",
      Formal: "Hi Alex,\n\nThank you for the additional request. I would be pleased to include the landing page, subject to confirming the associated scope and schedule adjustments.",
    }
    return `${openings[tone]}\n\nI’ll send over a short change order with the additional cost and revised delivery date for your review. If that works for you, I can begin right away.\n\nBest,\nJordan`
  }, [tone])

  async function copyReply() {
    await navigator.clipboard?.writeText(reply).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <button className={styles.brand} aria-label="Tactfully home">
          <span className={styles.brandGlyph}>T</span>
          <span className={styles.brandWord}>Tactfully</span>
        </button>

        <button className={styles.accountSwitch}>
          <span className={styles.accountMark}>J</span>
          <span><strong>Jordan Davis</strong><small>Studio workspace</small></span>
          <ChevronDown size={14} />
        </button>

        <nav className={styles.primaryNav} aria-label="Main navigation">
          <button className={styles.navItemActive}><LayoutGrid size={17} /><span>Overview</span></button>
          <button className={styles.navItem}><Sparkles size={17} /><span>New response</span><kbd>⌘N</kbd></button>
          <button className={styles.navItem}><Archive size={17} /><span>All drafts</span><em>24</em></button>
        </nav>

        <div className={styles.navGroupLabel}>COLLECTIONS</div>
        <nav className={styles.collectionNav}>
          <button><span className={styles.collectionDot} style={{ background: "#d7a87b" }} />Scope & pricing</button>
          <button><span className={styles.collectionDot} style={{ background: "#83a99d" }} />Following up</button>
          <button><span className={styles.collectionDot} style={{ background: "#9b91b5" }} />Client changes</button>
          <button><Plus size={13} />New collection</button>
        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.navItem}><Settings size={16} /><span>Settings</span></button>
          <button className={styles.navItem}><CircleHelp size={16} /><span>Help & feedback</span></button>
          <div className={styles.usageCard}>
            <div className={styles.usageTop}><span>Free</span><strong>33%</strong></div>
            <div className={styles.usageTrack}><span /></div>
            <p>1 of 3 generations used today</p>
          </div>
        </div>
      </aside>

      <main className={styles.workspace}>
        <div role="note" style={{ padding: "7px 18px", background: "#F5E9D9", color: "#795A39", borderBottom: "1px solid #E8D8C4", fontSize: 11, textAlign: "center" }}>
          Design preview · Sample data only · Not connected to your account
        </div>
        <header className={styles.topbar}>
          <div className={styles.mobileBrand}><span>T</span><strong>Tactfully</strong></div>
          <div className={styles.pageTitle}><span>Workspace</span><ChevronRight size={13} /><strong>Overview</strong></div>
          <div className={styles.topActions}>
            <button className={styles.searchBox}><Search size={15} /><span>Search</span><kbd>⌘ K</kbd></button>
            <button className={styles.iconButton} aria-label="Help"><CircleHelp size={17} /></button>
            <button className={styles.profileButton}>JD</button>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.heroRow}>
            <div>
              <p className={styles.kicker}>MONDAY, 21 NOVEMBER</p>
              <h1>Good morning, Jordan.</h1>
              <p className={styles.heroSubtitle}>Here’s what’s happening across your client conversations.</p>
            </div>
            <button className={styles.primaryButton} onClick={() => setMobileDraft(true)}><Plus size={16} />Write a response</button>
          </section>

          <section className={styles.metrics}>
            <article className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ background: "#edf4ef", color: "#587969" }}><Sparkles size={17} /></div>
              <div><span>Responses written</span><strong>128</strong></div>
              <small><b>+14%</b> this month</small>
            </article>
            <article className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ background: "#f4ede5", color: "#9a744e" }}><Clock3 size={17} /></div>
              <div><span>Time saved</span><strong>6.4h</strong></div>
              <small><b>+22%</b> this month</small>
            </article>
            <article className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ background: "#eceaf2", color: "#77708e" }}><Check size={17} /></div>
              <div><span>Replies sent</span><strong>92%</strong></div>
              <small>of completed drafts</small>
            </article>
          </section>

          <section className={styles.draftingArea}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionOverline}>YOUR RESPONSE DESK</p>
                <h2>Turn a difficult message into the right words.</h2>
              </div>
              <button className={styles.textButton} onClick={() => setGenerated(false)}>Clear <ArrowRight size={14} /></button>
            </div>

            <div className={styles.draftingGrid}>
              <article className={styles.messagePanel}>
                <div className={styles.panelHeader}><span>INCOMING MESSAGE</span><button><MoreHorizontal size={16} /></button></div>
                <div className={styles.senderRow}><span className={styles.senderAvatar}>AM</span><div><strong>Alex Morgan</strong><small>alex@northstar.studio</small></div><time>Just now</time></div>
                <div className={styles.messageText}>Hey Jordan — quick question. Could we also add the landing page to the project? We’d really like to keep the original launch date if possible.</div>

                <div className={styles.divider} />

                <div className={styles.controlGroup}>
                  <label>WHAT ARE YOU RESPONDING TO?</label>
                  <div className={styles.scenarioGrid}>{scenarios.map((item) => <button key={item} className={scenario === item ? styles.optionActive : ""} onClick={() => setScenario(item)}>{item}</button>)}</div>
                </div>

                <div className={styles.controlGroup}>
                  <label>HOW SHOULD IT SOUND?</label>
                  <div className={styles.toneGrid}>{tones.map((item) => <button key={item} className={tone === item ? styles.toneActive : ""} onClick={() => setTone(item)}>{tone === item && <Check size={13} />}{item}</button>)}</div>
                </div>

                <button className={styles.generateButton} onClick={() => setGenerated(true)}><WandSparkles size={17} />Create my response<ArrowRight size={16} /></button>
              </article>

              <article className={`${styles.responsePanel} ${generated ? styles.responseGenerated : ""}`}>
                <div className={styles.responseHeader}><span>SUGGESTED RESPONSE</span>{generated && <button onClick={copyReply}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>}</div>
                {generated ? (
                  <div className={styles.generatedContent}>
                    <div className={styles.confidenceLabel}><span />Ready to review</div>
                    <div className={styles.replyText}>{reply}</div>
                    <div className={styles.responseFooter}><button onClick={() => setGenerated(false)}><ArrowLeft size={14} />Start over</button><button onClick={() => setGenerated(true)}>Try another tone<ArrowRight size={14} /></button></div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIllustration}><span /><span /><span /></div>
                    <h3>A clearer response will appear here.</h3>
                    <p>Choose the situation and tone, then Tactfully will prepare a thoughtful starting point.</p>
                  </div>
                )}
              </article>
            </div>
          </section>

          <section className={styles.recentSection}>
            <div className={styles.recentHeader}><div><p className={styles.sectionOverline}>RECENTLY USED</p><h2>Continue a conversation</h2></div><button>View all <ArrowRight size={14} /></button></div>
            <div className={styles.draftTable}>
              <div className={styles.tableHeader}><span>CONVERSATION</span><span>TONE</span><span>STATUS</span><span>UPDATED</span><span /></div>
              {drafts.map((item, index) => (
                <button className={`${styles.draftRow} ${selectedDraft === index ? styles.draftRowActive : ""}`} key={item.name} onClick={() => setSelectedDraft(index)}>
                  <span className={styles.contactCell}><span className={styles.contactAvatar}>{item.name.split(" ").map((part) => part[0]).join("")}</span><span><strong>{item.name}</strong><small>{item.preview}</small></span></span>
                  <span className={styles.toneCell}>{item.tone}</span>
                  <span className={styles.statusCell}><i />{item.status}</span>
                  <span className={styles.timeCell}>{item.time}</span>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {mobileDraft && <div className={styles.mobileToast}><Check size={14} /> New response started<button onClick={() => setMobileDraft(false)}>×</button></div>}
      <div className={styles.previewLabel}><span />NEW PRODUCT EXPERIENCE</div>
    </div>
  )
}
