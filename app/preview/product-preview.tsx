"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Copy,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  WandSparkles,
} from "lucide-react"
import styles from "./product-preview.module.css"

const scenarios = ["Late payment", "Scope change", "Following up", "Saying no"]
const tones = ["Warm", "Direct", "Polished"]

const replies: Record<string, string> = {
  Warm: "Hi Alex,\n\nThanks for the update — I completely understand that priorities can shift. I’m happy to make room for the additional landing page. Since it’s outside the original scope, I’ll send over a quick estimate and an updated timeline for your approval before I get started.\n\nWould that work for you?\n\nBest,\nJordan",
  Direct: "Hi Alex,\n\nI can add the landing page. It falls outside our agreed scope, so I’ll need to confirm the additional cost and delivery date before starting. I’ll send both over today.\n\nPlease confirm once you’re happy to proceed.\n\nBest,\nJordan",
  Polished: "Hi Alex,\n\nThank you for sharing the additional request. I’d be glad to include the new landing page. As this extends beyond the project scope we agreed, I’ll prepare a concise change order with the associated fee and revised delivery date for your review.\n\nI’ll send that through shortly.\n\nKind regards,\nJordan",
}

const recent = [
  { initials: "AM", name: "Alex Morgan", subject: "One more thing for the launch…", label: "Scope change", time: "12 min ago", color: "peach" },
  { initials: "SK", name: "Sam Kim", subject: "Re: Invoice 1048 — payment date", label: "Late payment", time: "Yesterday", color: "lavender" },
  { initials: "JR", name: "Jamie Rivera", subject: "Checking in on the proposal", label: "Following up", time: "Yesterday", color: "mint" },
]

export function ProductPreview() {
  const [tone, setTone] = useState("Warm")
  const [scenario, setScenario] = useState("Scope change")
  const [reply, setReply] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeNav, setActiveNav] = useState("Workspace")

  function generateReply() {
    setReply(replies[tone])
    setCopied(false)
  }

  async function copyReply() {
    const text = reply || replies[tone]
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={styles.preview}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand} aria-label="Tactfully home">
          <span className={styles.brandMark}><MessageSquareText size={18} strokeWidth={2.2} /></span>
          <span>tactfully<span className={styles.brandDot}>.</span></span>
        </Link>

        <div className={styles.workspacePicker}>
          <div className={styles.workspaceAvatar}>J</div>
          <div className={styles.workspaceText}><strong>Jordan’s workspace</strong><span>Personal plan</span></div>
          <ChevronDown size={15} />
        </div>

        <div className={styles.navLabel}>WORKSPACE</div>
        <nav className={styles.nav} aria-label="Preview navigation">
          <button className={`${styles.navItem} ${activeNav === "Workspace" ? styles.navActive : ""}`} onClick={() => setActiveNav("Workspace")}><LayoutDashboard size={17} />Workspace</button>
          <button className={`${styles.navItem} ${activeNav === "Inbox" ? styles.navActive : ""}`} onClick={() => setActiveNav("Inbox")}><Inbox size={17} />Inbox<span className={styles.navCount}>4</span></button>
          <button className={`${styles.navItem} ${activeNav === "Saved replies" ? styles.navActive : ""}`} onClick={() => setActiveNav("Saved replies")}><FileText size={17} />Saved replies</button>
        </nav>

        <div className={styles.navLabel}>YOUR SPACE</div>
        <nav className={styles.nav}>
          <button className={styles.navItem} onClick={() => setActiveNav("Preferences")}><Settings2 size={17} />Preferences</button>
          <button className={styles.navItem} onClick={() => setActiveNav("Help center")}><CircleHelp size={17} />Help center</button>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.planCard}>
            <div className={styles.planIcon}><Sparkles size={15} /></div>
            <strong>A little more room?</strong>
            <p>Get more thoughtful replies with Tactfully Pro.</p>
            <Link href="/sign-up">Explore plans <ArrowRight size={13} /></Link>
          </div>
          <button className={styles.profileButton} onClick={() => setActiveNav("Your profile")}>
            <span className={styles.profileAvatar}>JD</span>
            <span className={styles.profileText}><strong>Jordan Davis</strong><small>jordan@example.com</small></span>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumb}><span>Workspace</span><span className={styles.slash}>/</span><strong>{activeNav}</strong></div>
          <div className={styles.topbarRight}>
            <button className={styles.searchButton}><Search size={15} /><span>Search anything</span><kbd><Command size={11} /> K</kbd></button>
            <button className={styles.helpButton} aria-label="Help"><CircleHelp size={17} /></button>
            <span className={styles.topAvatar}>JD</span>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.welcome}>
            <div>
              <div className={styles.eyebrow}><span className={styles.liveDot} /> YOUR COMMUNICATION DESK</div>
              <h1>A better reply<br className={styles.mobileBreak} /> starts here<span className={styles.headingPeriod}>.</span></h1>
              <p>Find the right words for the conversations that matter.</p>
            </div>
            <button className={styles.newButton} onClick={() => { setReply(""); setCopied(false) }}><Plus size={16} /> New draft</button>
          </section>

          <section className={styles.stats} aria-label="Workspace overview">
            <div className={styles.statCard}>
              <span className={styles.statIcon}><MessageSquareText size={17} /></span>
              <div className={styles.statMeta}><span>Replies drafted</span><strong>28</strong></div>
              <span className={styles.statTrend}><ArrowUpRight size={13} /> 18%</span>
              <small className={styles.statFoot}>this month</small>
            </div>
            <div className={styles.statCard}>
              <span className={`${styles.statIcon} ${styles.statIconMint}`}><Clock3 size={17} /></span>
              <div className={styles.statMeta}><span>Time saved</span><strong>2.4 <small>hrs</small></strong></div>
              <span className={styles.statTrend}><ArrowUpRight size={13} /> 12%</span>
              <small className={styles.statFoot}>this month</small>
            </div>
            <div className={`${styles.statCard} ${styles.statCardNote}`}>
              <div className={styles.noteIcon}><Sparkles size={15} /></div>
              <div className={styles.noteCopy}><strong>Thoughtful beats rushed.</strong><span>You’ve kept your tone consistent across every reply this week.</span></div>
              <ArrowRight size={16} className={styles.noteArrow} />
            </div>
          </section>

          <section className={styles.draftSection}>
            <div className={styles.sectionHeading}>
              <div><h2>Let’s find the words.</h2><p>A little context goes a long way.</p></div>
              <button className={styles.moreButton} aria-label="More options"><MoreHorizontal size={19} /></button>
            </div>

            <div className={styles.composerGrid}>
              <div className={styles.composerCard}>
                <div className={styles.fieldLabel}><span className={styles.fieldNumber}>01</span><label htmlFor="incoming-message">THE MESSAGE</label><span className={styles.optional}>Paste or type</span></div>
                <textarea id="incoming-message" className={styles.messageInput} defaultValue={'Hey Jordan, quick one — could you also add a landing page to the project? We’re hoping to keep the launch date the same. Thanks!'} />
                <div className={styles.charCount}>ALEX MORGAN <span>·</span> 136 characters</div>

                <div className={styles.formDivider} />
                <div className={styles.fieldLabel}><span className={styles.fieldNumber}>02</span><span>WHAT’S THE SITUATION?</span></div>
                <div className={styles.chipRow}>{scenarios.map((item) => <button key={item} className={`${styles.chip} ${scenario === item ? styles.chipSelected : ""}`} onClick={() => setScenario(item)}>{item}</button>)}</div>

                <div className={styles.fieldLabel}><span className={styles.fieldNumber}>03</span><span>SET THE TONE</span><button className={styles.toneHint}><CircleHelp size={13} /> pick what feels right</button></div>
                <div className={styles.toneRow}>{tones.map((item) => <button key={item} className={`${styles.toneButton} ${tone === item ? styles.toneSelected : ""}`} onClick={() => setTone(item)}>{tone === item && <Check size={13} />}{item}</button>)}</div>

                <button className={styles.generateButton} onClick={generateReply}><WandSparkles size={16} /> Draft my reply <ArrowRight size={15} /></button>
                <div className={styles.privacyNote}><span className={styles.lockDot} /> Your message stays yours. We never send anything for you.</div>
              </div>

              <div className={styles.replyColumn}>
                <div className={styles.replyTopline}><span>YOUR THOUGHTFUL REPLY</span><span className={styles.aiTag}><Sparkles size={12} /> A little help from AI</span></div>
                <article className={styles.replyCard}>
                  {reply ? (
                    <>
                      <div className={styles.replySuccess}><span><Check size={12} /></span> A draft that sounds like you</div>
                      <div className={styles.replyBody}>{reply}</div>
                      <div className={styles.replyActions}><button onClick={copyReply}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy reply"}</button><button onClick={generateReply}><WandSparkles size={14} /> Try another</button></div>
                    </>
                  ) : (
                    <>
                      <div className={styles.replyEmptyIcon}><ArrowDownLeft size={20} /></div>
                      <h3>Your next reply, made easier.</h3>
                      <p>Add a message and choose a tone. We’ll help you say what you mean, with a little more confidence.</p>
                      <div className={styles.replyPreview}>
                        <div className={styles.previewLineShort} /><div className={styles.previewLine} /><div className={styles.previewLine} /><div className={styles.previewLineMedium} />
                      </div>
                    </>
                  )}
                </article>
                <div className={styles.replyDisclaimer}><Sparkles size={13} /> A starting point, not the final word. Make it yours.</div>
                <div className={styles.shortcut}><kbd>⌘</kbd><kbd>↵</kbd><span>to draft a reply</span><Send size={14} /></div>
              </div>
            </div>
          </section>

          <section className={styles.recentSection}>
            <div className={styles.recentHeader}><div><h2>Recent conversations</h2><p>Pick up right where you left off.</p></div><button className={styles.viewAll} onClick={() => setActiveNav("Inbox")}>View all <ArrowRight size={14} /></button></div>
            <div className={styles.recentList}>{recent.map((item) => <button className={styles.recentItem} key={item.name} onClick={() => { setScenario(item.label); setReply("") }}><span className={`${styles.contactAvatar} ${styles[item.color]}`}>{item.initials}</span><span className={styles.conversationText}><strong>{item.name}</strong><small>{item.subject}</small></span><span className={styles.conversationLabel}>{item.label}</span><span className={styles.conversationTime}>{item.time}</span><ArrowRight size={15} className={styles.conversationArrow} /></button>)}</div>
          </section>

          <footer className={styles.footer}><span>Made for the moments when the right words matter.</span><span>TACTFULLY <i>© 2025</i></span></footer>
        </div>
      </main>
      <div className={styles.previewBadge}><span /> INTERACTIVE PRODUCT PREVIEW</div>
    </div>
  )
}
