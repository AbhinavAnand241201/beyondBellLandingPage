'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-navy">
      <div className="text-center max-w-md">
        <h2 className="font-black text-3xl text-navy mb-3 tracking-tight">
          Something went wrong.
        </h2>
        <p className="text-muted text-[15px] mb-6">
          Slow down. Try again — and if it still fails, refresh the page.
        </p>
        <button onClick={() => reset()} className="btn-primary text-sm">
          Try again
        </button>
      </div>
    </main>
  )
}
