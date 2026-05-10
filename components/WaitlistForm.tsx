'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, Loader2, Mail } from 'lucide-react'

const ROLES = [
  'Principal',
  'Vice Principal',
  'Coordinator',
  'Teacher',
  'Counsellor',
  'Other',
]


const BOARDS = ['CBSE', 'ICSE', 'IGCSE', 'Other']

type Status = 'idle' | 'loading' | 'success' | 'already' | 'error'
type FieldKey = 'full_name' | 'email' | 'role' | 'board'

interface Props {
  onSuccess?: () => void
}

export default function WaitlistForm({ onSuccess }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [errFields, setErrFields] = useState<Set<FieldKey>>(new Set())
  const [shake, setShake] = useState(false)

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
        body: JSON.stringify(form),
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
      onSuccess?.()
    } catch {
      setErrMsg('Something went wrong. Please try again.')
      setStatus('error')
      triggerShake()
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <span className="burst absolute inset-0 rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-amber/15 flex items-center justify-center">
            <CheckCircle2 style={{ width: 38, height: 38, color: '#CA8A04' }} />
          </div>
        </div>
        <h3 className="font-black text-2xl md:text-[28px] text-navy mb-3 tracking-tight">
          You&apos;re on the list.
        </h3>
        <p className="text-muted text-[16px] leading-relaxed max-w-md mx-auto">
          We&apos;ll reach out before BeyondBell Circle opens.
          <br />
          Until then —{' '}
          <em className="font-black text-navy not-italic">
            Slow down. Think better.
          </em>
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-amber-deep bg-amber-light border border-amber/30 rounded-full px-4 py-2">
          <Mail style={{ width: 14, height: 14 }} />
          We&apos;ll email you the moment we go live in July 2026.
        </div>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-amber/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 style={{ width: 38, height: 38, color: '#CA8A04' }} />
        </div>
        <h3 className="font-black text-2xl text-navy mb-3 tracking-tight">
          You&apos;re already on the list.
        </h3>
        <p className="text-muted text-[16px]">
          We have your details. We&apos;ll be in touch the day BeyondBell Circle
          goes live.
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
          <label htmlFor="board">School Board</label>
          <ChevronDown className="chev" style={{ width: 16, height: 16 }} />
        </div>
      </div>

      {status === 'error' && errMsg && (
        <p className="text-red-600 text-sm font-bold bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 animate-fade-in">
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
            Reserve My Spot
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-center text-[12px] text-muted pt-1">
        No spam. No noise. Just one email when BeyondBell Circle is live.
      </p>
    </form>
  )
}
