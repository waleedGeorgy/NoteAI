'use client'
import { ReactNode } from "react"
import { useFormStatus } from "react-dom"

const SummarizeButton = ({ pendingText, isNoteUpdating, children }: { pendingText: string, isNoteUpdating: boolean, children: ReactNode }) => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            aria-busy={pending}
            disabled={pending || isNoteUpdating}
            className="group relative inline-flex items-center justify-center px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute -inset-px rounded-lg bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300"></div>

            <div className="relative flex items-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <span className="bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-semibold flex items-center gap-1.5">
                    {pending ? pendingText : children}
                </span>
            </div>
        </button>
    )
}

export default SummarizeButton