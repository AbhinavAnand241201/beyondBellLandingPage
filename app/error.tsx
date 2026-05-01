'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="font-poppins text-3xl font-bold text-brand-black mb-2">Something went wrong</h2>
        <button
          onClick={() => reset()}
          className="bg-yellow-brand text-brand-black font-poppins font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-dark transition-all"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
