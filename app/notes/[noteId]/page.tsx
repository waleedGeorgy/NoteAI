'use client'
import Link from "next/link";
import { notFound, redirect, useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ArrowLeftSquare, Sparkles } from "lucide-react";
import DeleteButton from "@/app/_components/DeleteButton";
import SubmitButton from "@/app/_components/SubmitButton";
import SummarizeButton from "@/app/_components/SummarizeButton";
import { supabase } from "@/utils/supabase/client";
import { createToast } from "@/utils/createToast";
import { Note } from "@/utils/types";
import { deleteNote, updateNote } from "@/actions/notesActions";

const NoteDetailsPage = () => {
    const [note, setNote] = useState<Note>();

    const { noteId } = useParams<{ noteId: string }>();

    const [noteDeleteState, noteDeleteAction, isNoteDeleting] = useActionState(deleteNote, null);
    const [noteUpdateState, noteUpdateAction, isNoteUpdating] = useActionState(updateNote, null);

    useEffect(() => {
        const fetchCurrentNote = async () => {
            const { data: dbNote } = await supabase.from('notes').select('*').eq('id', noteId).single<Note>();
            if (!dbNote) return notFound();
            setNote(dbNote);
        }
        fetchCurrentNote();
    }, [noteId]);

    useEffect(() => {
        if (noteDeleteState?.supabaseError) createToast("error", noteDeleteState.supabaseError);
        else if (noteDeleteState?.success) {
            createToast("success", noteDeleteState.success);
            redirect("/dashboard");
        }
    }, [noteDeleteState]);

    useEffect(() => {
        if (noteUpdateState?.titleError) createToast("error", noteUpdateState.titleError);
        if (noteUpdateState?.contentError) createToast("error", noteUpdateState.contentError);
        if (noteUpdateState?.supabaseError) createToast("error", noteUpdateState.supabaseError);
        else if (noteUpdateState?.success) {
            createToast("success", noteUpdateState.success);
            redirect("/dashboard");
        }
    }, [noteUpdateState]);

    if (!note) {
        return (
            <div className="min-h-screen flex flex-row flex-1 items-center justify-center ">
                <svg className="mr-3 size-6 animate-spin text-indigo-300" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                <p className="text-2xl tracking-wider text-indigo-300">Loading note...</p>
            </div>
        )
    }

    return (
        <section className="relative mx-auto max-w-3xl p-8">
            <nav className="mb-4 text-sm text-gray-400">
                <Link className="hover:text-gray-200 transition-colors duration-200 flex items-center gap-1.5" href="/dashboard"><ArrowLeftSquare className="size-5" />Back to dashboard</Link>
            </nav>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.35)]">

                <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">Edit note</h2>
                        <time className="text-xs text-gray-400">
                            <span className="font-semibold">Last updated at:</span>{" "}
                            {new Date(note?.created_at).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "numeric" })}
                        </time>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <form /* action={summarizeNote} */>
                            <input type="hidden" name="id" value={note.id} />
                            <SummarizeButton pendingText="Summarizing…" isNoteUpdating={isNoteUpdating}><Sparkles className="size-4 text-cyan-300" />
                                Summarize
                            </SummarizeButton>
                        </form>

                        <form action={noteDeleteAction}>
                            <input type="hidden" name="id" value={note.id} />
                            <DeleteButton isNoteDeleting={isNoteDeleting} isNoteUpdating={isNoteUpdating} />
                        </form>
                    </div>
                </header>

                <form action={noteUpdateAction} className="grid gap-4">
                    <input type="hidden" name="id" value={note.id} />
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm text-zinc-300">Title</label>
                        <input
                            id="title"
                            name="title"
                            defaultValue={note.title}
                            required
                            disabled={isNoteUpdating}
                            className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/60"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="mb-1 block text-sm text-zinc-300">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            rows={8}
                            defaultValue={note.content}
                            disabled={isNoteUpdating}
                            className="w-full resize-y rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/60"
                        />
                    </div>
                    <div className="flex justify-center items-center gap-3 mt-2">
                        <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
                        <Link
                            href="/dashboard"
                            className={`rounded-xl bg-zinc-800/50 px-4 py-2.5 text-sm text-gray-300 hover:bg-zinc-800 transition-colors ring-1 ring-white/10 disabled:opacity-50 ${isNoteUpdating && "pointer-events-none opacity-50"}`} aria-disabled={isNoteUpdating}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

            {/* <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h2 className="text-base font-medium">Summary</h2>
                {!note.summary ? (
                    <p className="mt-2 text-sm text-zinc-400">
                        No summary yet — click <span className="text-zinc-200">Summarize</span> above.
                    </p>
                ) : (
                    <>
                        <p className="mt-2 text-sm text-zinc-200 whitespace-pre-wrap">{note.summary}</p>
                        {note.summarized_at && (
                            <p className="mt-3 text-xs text-zinc-500">
                                Generated {new Date(note.summarized_at).toLocaleString()}
                            </p>
                        )}
                    </>
                )}
            </div> */}
        </section>
    );
}

export default NoteDetailsPage