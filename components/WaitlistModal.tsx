'use client'

import { useState } from 'react'
import { X, AlertCircle, Loader2, Bell, Zap, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'

type Step = 'idle' | 'loading' | 'error'

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('idle')
  const [errMsg, setErr] = useState('')

  const handleGoogle = async () => {
    setStep('loading')
    const supabase = createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })

    if (error) {
      setErr(error.message)
      setStep('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
        <div className="h-1.5 bg-yellow-brand" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-grey flex items-center justify-center hover:bg-brand-border transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-brand-muted" />
        </button>

        <div className="px-8 py-8">
          {step === 'idle' && (
            <>
              <h2 className="font-poppins font-bold text-2xl text-brand-black mb-2">Join the Founding 500.</h2>
              <p className="text-brand-muted font-inter text-sm mb-6 leading-relaxed">
                Join the waitlist and we&apos;ll email you the moment we go live.
              </p>
              <div className="bg-yellow-light rounded-2xl p-4 mb-6 space-y-3">
                {[Bell, Zap, Users].map((Icon, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-yellow-brand flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-brand-black" />
                    </div>
                    <p className="text-sm font-inter text-brand-black leading-snug">Founding member benefit {i + 1}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 bg-brand-black text-white font-poppins font-semibold text-sm px-5 py-3.5 rounded-xl hover:bg-brand-navy transition-all hover:shadow-lg mb-4"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </>
          )}

          {step === 'loading' && (
            <div className="text-center py-10">
              <Loader2 className="w-12 h-12 text-yellow-brand animate-spin mx-auto mb-4" />
              <h3 className="font-poppins font-bold text-brand-black text-lg mb-2">Redirecting to Google...</h3>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-9 h-9 text-red-500" />
              </div>
              <h3 className="font-poppins font-bold text-xl text-brand-black mb-2">Something went wrong</h3>
              <p className="text-brand-muted font-inter text-sm mb-2">{errMsg || 'Please try again in a moment.'}</p>
              <button
                onClick={() => setStep('idle')}
                className="w-full bg-yellow-brand text-brand-black font-poppins font-semibold text-sm py-3.5 rounded-xl hover:bg-yellow-dark transition-all"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
