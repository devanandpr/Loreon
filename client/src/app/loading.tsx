export default function Loading() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />
        <p className="text-zinc-400 tracking-wide">
          Loading...
        </p>
      </div>
    </main>
  );
}