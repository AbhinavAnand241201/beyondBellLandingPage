import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="font-poppins text-3xl font-bold text-brand-black mb-2">Page not found</h1>
        <p className="text-brand-muted font-inter mb-6">The page you are looking for does not exist.</p>
        <Link href="/" className="text-yellow-dark font-semibold">Go back home</Link>
      </div>
    </main>
  )
}
