'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, Loader2, Lock, Mail, Sparkles, Star, Crown } from 'lucide-react'

const ROLES = [
  'Teacher',
  'Department Head (HOD)',
  'Principal',
  'School Admin',
  'Vice Principal',
  'Coordinator',
  'Counsellor',
  'Other',
]
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other']

type Plan = 'founding' | 'free'
type Status = 'idle' | 'loading' | 'success' | 'already' | 'error'
type FieldKey = 'full_name' | 'email' | 'role' | 'board'

interface Props {
  onSuccess?: (plan: Plan) => void
}

export default function WaitlistForm({ onSuccess }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [errFields, setErrFields] = useState<Set<FieldKey>>(new Set())
  const [shake, setShake] = useState(false)
  const [plan, setPlan] = useState<Plan>('founding')

  const [form, setForm] = useState<Record<FieldKey, string>>({
    full_name: '',
    email: '',
    role: '',
    board: '',
  })

  const set = (k: FieldKey) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errFields.has(k)) {
      const next = new Set(errFields)
      next.delete(k)
      setErrFields(next)
    }
  }

  const triggerShake = () => {
    setShake(true)
    window.setTimeout(() => setShake(false), 360)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    const missing = new Set<FieldKey>()
    if (!form.full_name.trim()) missing.add('full_name')
    if (!form.email.trim()) missing.add('email')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) missing.add('email')
    if (!form.role) missing.add('role')
    if (!form.board) missing.add('board')

    if (missing.size > 0) {
      setErrFields(missing)
      setErrMsg(
        missing.has('email') && form.email.trim()
          ? 'Please enter a valid email address.'
          : 'Please fill in all fields.'
      )
      setStatus('error')
      triggerShake()
      return
    }

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrMsg(data.message ?? 'Something went wrong. Please try again.')
        setStatus('error')
        triggerShake()
        return
      }

      if (data.already) {
        setStatus('already')
        return
      }

      setStatus('success')
      onSuccess?.(plan)
    } catch {
      setErrMsg('Something went wrong. Please try again.')
      setStatus('error')
      triggerShake()
    }
  }

  if (status === 'success') {
    const isFounding = plan === 'founding'
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <span className="burst absolute inset-0 rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-orange-pale flex items-center justify-center border border-orange-light">
            {isFounding ? (
              <Crown style={{ width: 36, height: 36, color: '#FF8A00' }} />
            ) : (
              <CheckCircle2 style={{ width: 38, height: 38, color: '#FF8A00' }} />
            )}
          </div>
        </div>
        <h3 className="font-sora font-bold text-2xl text-brown-dark mb-2 tracking-tight">
          {isFounding ? 'Founding spot reserved.' : "You're on the list."}
        </h3>
        <p className="text-muted text-[15px] leading-relaxed max-w-md mx-auto mb-4">
          {isFounding
            ? "We'll email payment instructions before launch — your ₹199 rate is locked for life."
            : "We'll reach out before BeyondBell Circle opens."}
        </p>
        <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-orange-deep bg-orange-pale border border-orange-light rounded-pill px-4 py-2">
          <Mail style={{ width: 14, height: 14 }} />
          One email when we go live.
        </div>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-orange-pale border border-orange-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 style={{ width: 38, height: 38, color: '#FF8A00' }} />
        </div>
        <h3 className="font-sora font-bold text-2xl text-brown-dark mb-3 tracking-tight">
          You&apos;re already on the list.
        </h3>
        <p className="text-muted text-[15px]">
          We have your details. We&apos;ll be in touch when BeyondBell Circle opens.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${shake ? 'animate-shake' : ''}`}
      noValidate
    >
      {/* ──────────── PLAN PICKER ──────────── */}
      <fieldset className="mb-1">
        <legend className="text-[11px] font-bold text-muted uppercase tracking-[0.18em] mb-2.5 px-1">
          Choose your access
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PlanCard
            value="founding"
            selected={plan === 'founding'}
            onSelect={setPlan}
            icon={<Crown size={16} />}
            title="Founding Member"
            price="₹199"
            cadence="/ month"
            badge="First 500"
            bullets={['Locked for life', 'Unlimited AI tools', 'Founding badge']}
          />
          <PlanCard
            value="free"
            selected={plan === 'free'}
            onSelect={setPlan}
            icon={<Sparkles size={16} />}
            title="Free"
            price="₹0"
            cadence="forever"
            bullets={['Community access', '1 trial of every tool', 'Morning Briefing']}
          />
        </div>
      </fieldset>

      {/* ──────────── FIELDS ──────────── */}
      <div className={`field ${form.full_name ? 'filled' : ''} ${errFields.has('full_name') ? 'error' : ''}`}>
        <input
          type="text"
          id="full_name"
          value={form.full_name}
          onChange={set('full_name')}
          placeholder=" "
          autoComplete="name"
          disabled={status === 'loading'}
        />
        <label htmlFor="full_name">Full Name</label>
      </div>

      <div className={`field ${form.email ? 'filled' : ''} ${errFields.has('email') ? 'error' : ''}`}>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={set('email')}
          placeholder=" "
          autoComplete="email"
          disabled={status === 'loading'}
        />
        <label htmlFor="email">Email Address</label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`field ${form.role ? 'filled' : ''} ${errFields.has('role') ? 'error' : ''}`}>
          <select
            id="role"
            value={form.role}
            onChange={set('role')}
            disabled={status === 'loading'}
          >
            <option value="" disabled hidden></option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label htmlFor="role">Your Role</label>
          <ChevronDown className="chev" style={{ width: 16, height: 16 }} />
        </div>

        <div className={`field ${form.board ? 'filled' : ''} ${errFields.has('board') ? 'error' : ''}`}>
          <select
            id="board"
            value={form.board}
            onChange={set('board')}
            disabled={status === 'loading'}
          >
            <option value="" disabled hidden></option>
            {BOARDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <label htmlFor="board">Board</label>
          <ChevronDown className="chev" style={{ width: 16, height: 16 }} />
        </div>
      </div>

      {status === 'error' && errMsg && (
        <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {errMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Reserving your spot...
          </>
        ) : (
          <>
            {plan === 'founding' ? 'Reserve Founding Spot' : 'Join the Free Waitlist'}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-center text-[12px] text-muted pt-1 flex items-center justify-center gap-1.5">
        <Lock size={11} className="text-orange-main" />
        {plan === 'founding'
          ? 'Payment details emailed before launch. No charge today.'
          : 'No spam. Just meaningful updates.'}
      </p>
    </form>
  )
}

/* ─────────────────────────────────────────────
   Plan picker card — radio-like, big tap target.
   ───────────────────────────────────────────── */
function PlanCard({
  value,
  selected,
  onSelect,
  icon,
  title,
  price,
  cadence,
  badge,
  bullets,
}: {
  value: Plan
  selected: boolean
  onSelect: (v: Plan) => void
  icon: React.ReactNode
  title: string
  price: string
  cadence: string
  badge?: string
  bullets: string[]
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? 'border-orange-main bg-orange-pale shadow-[0_8px_20px_-6px_rgba(255,138,0,0.35)] scale-[1.01]'
          : 'border-brown-dark/10 bg-white hover:border-orange-light hover:bg-orange-pale/40'
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 bg-orange-main text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill shadow-soft">
          {badge}
        </span>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              selected ? 'bg-orange-main text-white' : 'bg-orange-pale text-orange-main'
            }`}
          >
            {icon}
          </span>
          <span className="font-sora font-bold text-[14px] text-brown-dark">
            {title}
          </span>
        </div>

        {/* Radio indicator */}
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? 'border-orange-main bg-orange-main' : 'border-brown-dark/20 bg-white'
          }`}
          aria-hidden
        >
          {selected && (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-2.5">
        <span className="font-sora font-extrabold text-[22px] text-brown-dark tabular-nums leading-none">
          {price}
        </span>
        <span className="text-[11px] text-muted">{cadence}</span>
      </div>

      <ul className="space-y-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-brown-dark/75 leading-snug">
            <Star
              size={9}
              fill="currentColor"
              className={selected ? 'text-orange-main mt-1 shrink-0' : 'text-brown-dark/30 mt-1 shrink-0'}
            />
            {b}
          </li>
        ))}
      </ul>
    </button>
  )
}
