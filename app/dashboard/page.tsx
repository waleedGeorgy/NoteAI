'use client'
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, Loader2, PlusCircle, Sparkles, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { addNote, deleteNote } from "@/actions/notesActions";
import { supabase } from "@/utils/supabase/client";
import { createToast } from "@/utils/createToast";
import { Note } from "@/utils/types";
import LogoutButton from "../_components/LogoutButton";
import SubmitButton from "../_components/SubmitButton";
import Modal from "../_components/Modal";
import DeleteButton from "../_components/DeleteButton";
import Logo from "@/app/icon.png";

const DashboardPage = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>();
    const [isNotesLoading, setIsNotesLoading] = useState<boolean>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deletingNoteId, setDeletingNoteId] = useState<string>();

    const [addNotesState, addNotesAction, isNoteAdding] = useActionState(addNote, {});
    const [noteDeleteState, noteDeleteAction, isNoteDeleting] = useActionState(deleteNote, null);

    const router = useRouter();

    useEffect(() => {
        const getCurrentUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) setUserEmail(data.user.email as string);
        }
        getCurrentUser();
    }, []);

    useEffect(() => {
        const fetchNotes = async () => {
            setIsNotesLoading(true);
            const { data: dbNotes, error } = await supabase
                .from("notes")
                .select("id, title, content, created_at, updated_at, summary")
                .order("created_at", { ascending: false });

            if (error) {
                createToast("error", error.message);
            } else {
                setNotes(dbNotes);
            }
            router.refresh();
            setIsNotesLoading(false);
            setIsModalOpen(false);
        }
        fetchNotes();

        if (addNotesState.titleError) createToast("error", addNotesState.titleError);
        else if (addNotesState.contentError) createToast("error", addNotesState.contentError);
        else if (addNotesState.supabaseError) createToast("error", addNotesState.supabaseError);
        else if (addNotesState.success) createToast("success", addNotesState.success);

    }, [addNotesState, router]);

    useEffect(() => {
        if (noteDeleteState?.supabaseError) createToast("error", noteDeleteState.supabaseError);
        else if (noteDeleteState?.success) {
            createToast("success", noteDeleteState.success);

            const t = setTimeout(() => {
                setNotes(prev => prev?.filter(note => note.id !== noteDeleteState.id));
                setDeletingNoteId(noteDeleteState.id);
            }, 0);

            router.refresh();

            return () => clearTimeout(t);
        }
    }, [noteDeleteState, router]);

    return (
        <section className="relative mx-auto max-w-7xl p-8">
            <div className="flex gap-2 mb-8 items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Image src={Logo} alt="Mnemo.ai logo" width={28} height={28} />
                        <h2 className="text-2xl font-semibold">Your Notes</h2>
                    </div>
                    {!userEmail ?
                        <div className="flex items-center gap-1.5">
                            <Loader2 className="size-4 animate-spin text-gray-500" />
                            <span className="font-light text-gray-500">Loading user info</span>
                        </div>
                        :
                        <div className="flex items-center gap-1 text-indigo-400">
                            <User className="size-4" />
                            <span>{userEmail}</span>
                        </div>
                    }
                </div>
                <div className="flex items-center gap-3.5">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-lg border border-indigo-500/30 bg-indigo-500/25 px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500/45 transition-colors duration-200 flex items-center justify-center gap-1.5 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isNoteAdding || isNoteDeleting}
                    >
                        <PlusCircle className="size-4" />Add Note
                    </button>
                    <LogoutButton disabled={isNoteAdding || isNoteDeleting} />
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !isNoteAdding && setIsModalOpen(false)} isNoteAdding={isNoteAdding}>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-100">Add a note</h3>
                    <p className="mt-1 text-sm text-gray-400">Add a new note to your collection</p>
                </div>

                <form
                    action={addNotesAction}
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="modal-title" className="mb-1 block text-sm text-gray-300">
                            Title
                        </label>
                        <input
                            id="modal-title"
                            name="title"
                            required
                            placeholder="Brief note title"
                            className="w-full rounded-xl bg-zinc-800/50 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
                            disabled={isNoteAdding}
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-content" className="mb-1 block text-sm text-gray-300">
                            Content
                        </label>
                        <textarea
                            id="modal-content"
                            name="content"
                            rows={4}
                            placeholder="Note contents"
                            className="w-full rounded-xl bg-zinc-800/50 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500 resize-y"
                            disabled={isNoteAdding}
                        />
                    </div>
                    <div className="pt-2">
                        <div className="flex gap-3">
                            <SubmitButton pendingText="Adding..." disabled={isNoteAdding || isNoteDeleting}>
                                Add note
                            </SubmitButton>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isNoteAdding}
                                className="rounded-xl bg-zinc-800/50 px-3 text-sm text-gray-300 hover:bg-zinc-800 transition-colors ring-1 ring-white/10 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {isNotesLoading ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-gray-400 animate-pulse flex items-center justify-center gap-1.5">
                    <Loader2 className="size-5 animate-spin" />Loading your notes...
                </div>
            ) : notes?.length === 0 && !isNotesLoading ?
                (<div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
                    You don&apos;t have any notes yet. Click on &quot;Add Note&quot; to create one.
                </div>)
                :
                (<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                    {notes?.map((note) => (
                        <li
                            className="rounded-lg border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl hover:bg-linear-to-br hover:from-white/7 hover:to-indigo-500/15 transition duration-300 group"
                            key={note.id}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <Link href={`/notes/${note.id}`} className="text-xl font-semibold text-gray-100 line-clamp-2 group-hover:underline underline-offset-2 group-hover:text-indigo-300">
                                    {note.title}
                                </Link>
                                <div className="flex items-center gap-1.5">
                                    {note.summary && <Sparkles className="size-4 text-indigo-400 mr-1" />}
                                    <Link href={`/notes/${note.id}`} className={`rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 py-2 text-xs text-indigo-100 hover:bg-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isNoteDeleting && "pointer-events-none opacity-50"}`} title="Edit note" aria-disabled={isNoteDeleting}>
                                        <Edit className="size-4 " />
                                    </Link>
                                    <form action={noteDeleteAction}>
                                        <input type="hidden" name="id" value={note.id} />
                                        <DeleteButton
                                            isNoteDeleting={isNoteDeleting}
                                            currentNoteId={note.id}
                                            deletingNoteId={deletingNoteId}
                                        />
                                    </form>
                                </div>
                            </div>
                            <p className="mt-4 line-clamp-3 text-gray-300 whitespace-pre-wrap">
                                {note.content}
                            </p>
                            <div className="mt-7 text-xs text-gray-400 flex flex-col gap-1 items-end font-mono">
                                <time>
                                    <span className="font-semibold">Created at:</span>{" "}
                                    {new Date(note.created_at).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "numeric" })}
                                </time>
                                {note.created_at !== note.updated_at &&
                                    <time>
                                        <span className="font-semibold">Last updated:</span>{" "}
                                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}                                    </time>
                                }
                            </div>
                        </li>
                    ))}
                </ul>)
            }
        </section >
    );
}

export default DashboardPage;