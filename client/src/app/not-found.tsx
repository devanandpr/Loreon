import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-7xl font-bold mb-4">
        404
      </h1>

      <p className="text-zinc-400 mb-8">
        The page you're looking for doesn't exist.
      </p>

      <Link
        href="/"
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
      >
        Return Home
      </Link>
    </main>
  );
}