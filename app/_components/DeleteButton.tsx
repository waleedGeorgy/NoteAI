import { useFormStatus } from "react-dom";

const DeleteButton = ({
    isNoteDeleting,
    text,
    noteId,
    deletingNoteId
}: {
    isNoteDeleting: boolean;
    text: string;
    noteId?: string;
    deletingNoteId?: string | null;
}) => {
    // Use useFormStatus for pending state within the form
    const { pending } = useFormStatus();

    // Check if this specific note is being deleted
    const isDeletingThisNote = pending || (isNoteDeleting && deletingNoteId === noteId);

    return (
        <button
            className="rounded-lg border border-orange-600/30 bg-orange-600/10 px-3.5 py-2 text-sm text-orange-100 hover:bg-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-600/40 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletingThisNote}
            type="submit"
        >
            {isDeletingThisNote ? "Deleting..." : text}
        </button>
    );
}

export default DeleteButton;