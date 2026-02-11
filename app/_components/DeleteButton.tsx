import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";

const DeleteButton = ({
    isNoteDeleting,
    currentNoteId,
    deletingNoteId,
    isNoteUpdating,
    isNoteSummarizing
}: {
    isNoteDeleting: boolean;
    currentNoteId?: string;
    isNoteUpdating?: boolean;
    isNoteSummarizing?: boolean;
    deletingNoteId?: string | null;
}) => {
    const { pending } = useFormStatus();

    const isDeletingThisNote = pending || (isNoteDeleting && deletingNoteId === currentNoteId);

    return (
        <button
            className="rounded-lg border border-red-600/30 bg-red-600/10 px-3 py-2 text-xs text-red-100 hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-600/40 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletingThisNote || isNoteUpdating || isNoteDeleting || isNoteSummarizing}
            type="submit"
            aria-label="Delete note"
            title="Delete note"
        >
            {isDeletingThisNote ?
                <Loader2 className="size-4 animate-spin" />
                :
                <Trash2 className="size-4" />
            }
        </button>
    );
}

export default DeleteButton;