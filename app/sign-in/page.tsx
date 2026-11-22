"use client"
import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Eye, EyeOff, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const router = useRouter()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [showPassword,setShowPassword] = useState(false)
  const [error,setError] = useState<string|null>(null)
  const [loading,setLoading] = useState(false)
  async function handleSubmit(e:FormEvent) {
    e.preventDefault(); setLoading(true); setError(null)
    const supabase=createClient()
    const {error}=await supabase.auth.signInWithPassword({email,password})
    setLoading(false)
    if(error){setError(error.message);return}
    const requestedNext=new URLSearchParams(window.location.search).get("next")
    const next=requestedNext&&requestedNext.startsWith("/")&&!requestedNext.startsWith("//")&&!requestedNext.includes("\\")?requestedNext:"/dashboard"
    router.replace(next);router.refresh()
  }
  return <main className="grid min-h-screen bg-white lg:grid-cols-[1fr_.92fr]">
    <section className="relative flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-16">
      <Link href="/" className="inline-flex w-fit items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950"><span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white"><MessageSquareText size={18}/></span>tactfully<span className="text-indigo-600">.</span></Link>
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-700"><ArrowLeft size={14}/> Back to home</Link>
        <div className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Welcome back</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-.05em] text-slate-950">Good to have you back.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to pick up where you left off and keep your client conversations moving.</p>
        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <div><label htmlFor="email" className="mb-2 block text-xs font-semibold text-slate-700">Email address</label><input id="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"/></div>
          <div><label htmlFor="password" className="mb-2 block text-xs font-semibold text-slate-700">Password</label><div className="relative"><input id="password" type={showPassword?"text":"password"} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div>
          {error&&<p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</p>}
          <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{loading?"Signing in…":"Sign in"}{!loading&&<ArrowRight size={16}/>}</button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">New to Tactfully? <Link href="/sign-up" className="font-bold text-indigo-600 hover:text-indigo-700">Create a free account</Link></p>
      </div>
      <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} Tactfully. You stay in control of every reply.</p>
    </section>
    <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(99,102,241,.35),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(79,70,229,.25),transparent_35%)]"/>
      <div className="relative flex items-center gap-2 text-xs font-semibold text-indigo-200"><Sparkles size={14}/> CLIENT COMMUNICATION, WITH CLARITY</div>
      <div className="relative max-w-xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-indigo-200"><ShieldCheck size={13}/> Thoughtful drafts. Your final call.</div><h2 className="text-5xl font-extrabold leading-[1.08] tracking-[-.05em]">The right words can change the whole conversation.</h2><p className="mt-6 max-w-md text-sm leading-7 text-slate-300">Pick up your draft, refine your tone and get back to doing the work that matters.</p></div>
      <div className="relative rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">A reminder</div><p className="mt-2 text-sm leading-6 text-slate-200">You don't need to choose between protecting your boundaries and treating clients with respect.</p></div>
    </aside>
  </main>
}
