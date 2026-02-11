'use client'
import Link from "next/link";
import { notFound, redirect, useParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ArrowLeftSquare, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import DeleteButton from "@/app/_components/DeleteButton";
import SubmitButton from "@/app/_components/SubmitButton";
import SummarizeButton from "@/app/_components/SummarizeButton";
import { supabase } from "@/utils/supabase/client";
import { createToast } from "@/utils/createToast";
import { Note } from "@/utils/types";
import { deleteNote, updateNote } from "@/actions/notesActions";

const NoteDetailsPage = () => {
    const [note, setNote] = useState<Note>();
    const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

    const { noteId } = useParams<{ noteId: string }>();

    const router = useRouter();

    const [noteDeleteState, noteDeleteAction, isNoteDeleting] = useActionState(deleteNote, null);
    const [noteUpdateState, noteUpdateAction, isNoteUpdating] = useActionState(updateNote, null);

    const actionsDisabled = isSummarizing || isNoteDeleting || isNoteUpdating;

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

            const t = setTimeout(() => setNote(noteUpdateState.updatedNote), 0);

            router.refresh();

            return () => clearTimeout(t);
        }
    }, [noteUpdateState, router]);

    const handleSummaryGenerated = (newSummary: string) => {
        setNote(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                summary: newSummary,
                summarized_at: new Date().toISOString()
            };
        });
    };

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
        <section className="relative py-8 lg:px-16 px-8">
            <nav className="mb-4 text-sm text-gray-400">
                <Link className="hover:text-gray-200 transition-colors duration-200 flex items-center gap-1.5" href="/dashboard"><ArrowLeftSquare className="size-5" />Back to dashboard</Link>
            </nav>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.35)]">

                    <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">Edit note</h2>
                            <time className="text-xs text-gray-400 font-mono">
                                <span className="font-semibold">Last updated:</span>{" "}
                                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                            </time>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <form>
                                <input type="hidden" name="id" value={note.id} />
                                <SummarizeButton
                                    noteId={note.id}
                                    content={note.content}
                                    onSummaryGenerated={handleSummaryGenerated}
                                    setIsSummarizing={setIsSummarizing}
                                    disabled={actionsDisabled}
                                />
                            </form>

                            <form action={noteDeleteAction}>
                                <input type="hidden" name="id" value={note.id} />
                                <DeleteButton isNoteDeleting={isNoteDeleting} isNoteUpdating={isNoteUpdating} isNoteSummarizing={isSummarizing} />
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
                                disabled={actionsDisabled}
                                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/60"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="mb-1 block text-sm text-zinc-300">Content</label>
                            <textarea
                                id="content"
                                name="content"
                                rows={8}
                                defaultValue={note.content}
                                disabled={actionsDisabled}
                                className="w-full resize-y rounded-xl bg-zinc-900/70 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/60"
                            />
                        </div>
                        <div className="flex justify-center items-center gap-3 mt-2">
                            <SubmitButton pendingText="Saving…" disabled={actionsDisabled}>Save changes</SubmitButton>
                            <Link
                                href="/dashboard"
                                className={`rounded-xl bg-zinc-800/50 px-4 py-2.5 text-sm text-gray-300 hover:bg-zinc-800 transition-colors ring-1 ring-white/10 disabled:opacity-50 ${actionsDisabled && "pointer-events-none opacity-50"}`} aria-disabled={actionsDisabled}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
                    {!note.summary ? (
                        <p className="text-sm text-gray-300 flex flex-row items-center justify-center">
                            No summary yet — click the
                            <span className="text-indigo-400 flex flex-row items-center gap-1 mx-1.5">
                                <Sparkles className="size-3.5" />Summarize
                            </span>
                            button to generate an AI summary of this note.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-1">
                                <h2 className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
                                    <Sparkles className="size-4 text-indigo-400" />
                                    AI Summary
                                </h2>
                                <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                                    <p className="font-semibold">Generated at:</p>
                                    {note.summarized_at &&
                                        <time>
                                            {new Date(note.summarized_at).toLocaleString('en-GB', { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </time>
                                    }
                                </span>
                            </div>
                            <hr className="text-gray-700" />
                            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {note.summary}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}

export default NoteDetailsPage