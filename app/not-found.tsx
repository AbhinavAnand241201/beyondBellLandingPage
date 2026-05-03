import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-navy">
      <div className="text-center max-w-md">
        <h1 className="font-black text-4xl text-navy mb-3 tracking-tight">
          Page not found.
        </h1>
        <p className="text-muted text-[15px] mb-6">
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="btn-primary text-sm">
          Go back home
        </Link>
      </div>
    </main>
  )
}
