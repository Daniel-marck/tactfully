"use client"
import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, MessageSquareText, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const router=useRouter()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [showPassword,setShowPassword]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const [loading,setLoading]=useState(false)
  const [submitted,setSubmitted]=useState(false)
  async function handleSubmit(e:FormEvent){
    e.preventDefault();setLoading(true);setError(null)
    const supabase=createClient()
    const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${window.location.origin}/auth/callback?next=/dashboard`}})
    setLoading(false)
    if(error){setError(error.message);return}
    if(data.session){router.replace("/dashboard");router.refresh();return}
    setSubmitted(true)
  }
  return <main className="grid min-h-screen bg-[#F4F0E7] lg:grid-cols-[1fr_.92fr]">
    <section className="relative flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-16">
      <Link href="/" className="inline-flex w-fit items-center gap-2.5 text-lg font-extrabold tracking-tight text-stone-950"><span className="grid size-9 place-items-center rounded-xl bg-forest-600 text-white"><MessageSquareText size={18}/></span>tactfully<span className="text-forest-600">.</span></Link>
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-forest-700"><ArrowLeft size={14}/> Back to home</Link>
        {submitted?<><div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Check size={22}/></div><div className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-forest-600">One last step</div><h1 className="mt-3 text-4xl font-extrabold tracking-[-.05em] text-stone-950">Check your inbox.</h1><p className="mt-3 text-sm leading-6 text-stone-500">We sent a confirmation link to <strong className="text-stone-800">{email}</strong>. Confirm your email to activate your account.</p><Link href="/sign-in" className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-forest-600 text-sm font-bold text-white hover:bg-forest-700">Continue to sign in <ArrowRight size={16}/></Link></>:<>
          <div className="text-xs font-bold uppercase tracking-[.16em] text-forest-600">Start with a clearer reply</div><h1 className="mt-3 text-4xl font-extrabold tracking-[-.05em] text-stone-950">Make difficult messages easier.</h1><p className="mt-3 text-sm leading-6 text-stone-500">Create your free account and get a thoughtful starting point for your next client conversation.</p>
          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-xs font-semibold text-stone-700">Email address</label><input id="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-forest-400 focus:ring-4 focus:ring-forest-100"/></div>
            <div><label htmlFor="password" className="mb-2 block text-xs font-semibold text-stone-700">Create password</label><div className="relative"><input id="password" type={showPassword?"text":"password"} required minLength={6} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-forest-400 focus:ring-4 focus:ring-forest-100"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"} className="absolute right-3 top-1/2 -transtone-y-1/2 rounded-lg p-2 text-stone-400 hover:text-stone-700">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div><p className="mt-2 text-[10px] text-stone-400">Use at least 6 characters.</p></div>
            {error&&<p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</p>}
            <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest-600 text-sm font-bold text-white shadow-lg shadow-forest-600/20 transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60">{loading?"Creating account…":"Create free account"}{!loading&&<ArrowRight size={16}/>}</button>
          </form>
          <p className="mt-7 text-center text-sm text-stone-500">Already have an account? <Link href="/sign-in" className="font-bold text-forest-600 hover:text-forest-700">Sign in</Link></p>
        </>}
      </div>
      <p className="text-[10px] text-stone-400">© {new Date().getFullYear()} Tactfully. No pressure. Just better words.</p>
    </section>
    <aside className="relative hidden overflow-hidden bg-stone-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(49,93,71,.35),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(36,74,58,.25),transparent_35%)]"/>
      <div className="relative flex items-center gap-2 text-xs font-semibold text-forest-200"><Sparkles size={14}/> A BETTER WAY TO HANDLE CLIENT WORK</div>
      <div className="relative max-w-xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-forest-200"><Check size={13}/> Start free</div><h2 className="text-5xl font-extrabold leading-[1.08] tracking-[-.05em]">Be clear. Be kind. Keep your boundaries.</h2><p className="mt-6 max-w-md text-sm leading-7 text-stone-300">From scope changes to overdue invoices, find a confident way to move the conversation forward.</p></div>
      <div className="relative grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><div className="text-2xl font-bold">3/day</div><div className="mt-1 text-[10px] text-stone-400">Free AI replies</div></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><div className="text-2xl font-bold">3</div><div className="mt-1 text-[10px] text-stone-400">Reply options</div></div></div>
    </aside>
  </main>
}
