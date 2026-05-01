import Link from 'next/link'

export default function WaitlistSuccessPage() {
  return (
    <main className="min-h-screen bg-brand-grey flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-brand-border rounded-2xl p-8 text-center">
        <h1 className="font-poppins text-3xl font-bold text-brand-black mb-3">You are on the waitlist.</h1>
        <p className="text-brand-muted font-inter mb-6">
          Thanks for joining BeyondBell Circle. We will notify you as soon as early access is live.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-yellow-brand text-brand-black font-poppins font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-dark transition-all"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
