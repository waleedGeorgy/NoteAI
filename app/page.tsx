import Link from "next/link";
import { BrainCircuit, LockKeyhole, LogIn, UserPlus } from "lucide-react";

const HomePage = async () => {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">NoteAI</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-300">
          Take your notes, and let AI handle the rest. Start off by signing in for free.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_20px_rgba(0,0,0,0.4)] transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 flex items-center justify-center gap-2"
          >
            <LogIn className="size-5" />Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-100 backdrop-blur-xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center gap-2"
          >
            <UserPlus className="size-5" />Create account
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-xl">
            <h3 className="font-semibold text-gray-200 flex items-center gap-2"><LockKeyhole className="size-5" />Secure by default</h3>
            <p className="mt-1 text-sm text-gray-400">Row Level Security via Supabase</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-xl">
            <h3 className="font-semibold text-gray-200 flex items-center gap-2"><BrainCircuit className="size-5" />AI summaries</h3>
            <p className="mt-1 text-sm text-gray-400">Turn long notes into quick insights</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage