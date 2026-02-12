'use client'
import { ReactNode } from "react"
import { useFormStatus } from "react-dom"

type SubmitButtonProps = {
    pendingText: string,
    disabled?: boolean,
    children: ReactNode
}

const SubmitButton = ({ pendingText, children, disabled }: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending || disabled}
            aria-busy={pending || disabled}
            className={
                `inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm 
                text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_20px_rgba(0,0,0,0.35)]
                transition focus:outline-none focus:ring-2 focus:ring-indigo-400/70
                ${pending || disabled ? 'opacity-60 pointer-events-none' : 'rounded-lg border border-indigo-500/30 bg-indigo-500/25 px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors duration-200'} `
            }
        >
            {pending && (
                <svg className="mr-2 size-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
            )}
            {pending ? pendingText : children}
        </button>
    )
}

export default SubmitButton