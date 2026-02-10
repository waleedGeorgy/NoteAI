'use client'
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addNote, deleteNote } from "@/actions/notesActions";
import { supabase } from "@/utils/supabase/client";
import { createToast } from "@/utils/createToast";
import { Note } from "@/utils/types";
import LogoutButton from "../_components/LogoutButton";
import SubmitButton from "../_components/SubmitButton";
import Modal from "../_components/Modal";
import DeleteButton from "../_components/DeleteButton";


const DashboardPage = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>();
    const [isNotesLoading, setIsNotesLoading] = useState<boolean>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

    const router = useRouter();

    const handleDeleteAction = async (prevState: unknown, formData: FormData) => {
        const id = formData.get('id') as string;
        setDeletingNoteId(id);

        const result = await deleteNote(prevState, formData);

        setDeletingNoteId(null);

        if (result.supabaseError) createToast("error", result.supabaseError);
        else if (result.success) createToast("success", result.success);

        setNotes(prevNotes => prevNotes?.filter(note => note.id !== id) || []);
        router.refresh();
    };

    const [addNotesState, addNotesAction, isPending] = useActionState(addNote, {});
    const [noteDeleteState, noteDeleteAction, isNoteDeleting] = useActionState(handleDeleteAction, null);

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
                .select("id, title, content, created_at, updated_at")
                .order("created_at", { ascending: false });

            if (error) {
                createToast("error", error.message);
            } else {
                setNotes(dbNotes);
            }
            setIsNotesLoading(false);
            setIsModalOpen(false);
            router.refresh();
        }

        fetchNotes();

        if (addNotesState.titleError) createToast("error", addNotesState.titleError);
        else if (addNotesState.contentError) createToast("error", addNotesState.contentError);
        else if (addNotesState.supabaseError) createToast("error", addNotesState.supabaseError);
        else if (addNotesState.success) createToast("success", addNotesState.success);

    }, [addNotesState, router]);

    return (
        <section className="relative mx-auto max-w-7xl p-6">
            <div className="flex gap-2 mb-6 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Your Notes</h2>
                    {!userEmail ?
                        <p className="text-sm text-gray-400">Loading user...</p>
                        :
                        <p className="text-sm text-gray-400">Signed in as <span className="text-indigo-500 font-semibold">{userEmail}</span></p>
                    }
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded border border-indigo-500/30 bg-indigo-500/25 px-3 py-1.5 text-sm text-indigo-100 hover:bg-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500/45 transition-colors duration-200"
                        disabled={isPending}
                    >
                        + Add Note
                    </button>
                    <LogoutButton />
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !isPending && setIsModalOpen(false)}>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-100">Create a note</h3>
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
                            disabled={isPending}
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
                            disabled={isPending}
                        />
                    </div>
                    <div className="pt-2">
                        <div className="flex gap-3">
                            <SubmitButton
                                pendingText="Adding..."
                            >
                                Add note
                            </SubmitButton>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isPending}
                                className="rounded-xl bg-zinc-800/50 px-3 text-sm text-gray-300 hover:bg-zinc-800 transition-colors ring-1 ring-white/10 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {isNotesLoading ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-gray-400 animate-pulse">
                    Loading your notes...
                </div>
            ) : notes?.length === 0 && !isNotesLoading ?
                (<div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
                    You don&apos;t have any notes yet. Click on &quot;Add Note&quot; to create your one.
                </div>)
                :
                (<ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:grid-cols-2">
                    {notes?.map((note) => (
                        <li
                            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-xl hover:bg-linear-to-br hover:from-white/10 hover:to-indigo-500/20 transition group"
                            key={note.id}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <Link
                                    href={`/notes/${note.id}`}
                                    className="grow group-hover:underline underline-offset-3"
                                >
                                    <p className="text-xl font-semibold text-gray-100">{note.title}</p>
                                </Link>
                                <form action={noteDeleteAction}>
                                    <input type="hidden" name="id" value={note.id} />
                                    <DeleteButton
                                        isNoteDeleting={isNoteDeleting}
                                        text="Delete"
                                        noteId={note.id}
                                        deletingNoteId={deletingNoteId}
                                    />
                                </form>
                            </div>

                            <Link href={`/notes/${note.id}`} className="block">
                                <p className="mt-2 line-clamp-3 text-gray-300 whitespace-pre-wrap hover:text-gray-100 transition-colors">
                                    {note.content}
                                </p>
                                <div className="mt-5 text-xs text-gray-400 flex flex-col gap-1 items-end">
                                    <time>
                                        <span className="font-semibold">Created at:</span>{" "}
                                        {new Date(note.created_at).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "numeric" })}
                                    </time>
                                    {note.created_at !== note.updated_at &&
                                        <time>
                                            <span className="font-semibold">Last updated at:</span>{" "}
                                            {new Date(note.updated_at).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "numeric" })}
                                        </time>
                                    }
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>)
            }
        </section >
    );
}

export default DashboardPage;