'use client'
import { Sparkles } from 'lucide-react';
import puter from '@heyputer/puter.js';
import { createNoteSummary } from '@/actions/notesActions';
import { createToast } from '@/utils/createToast';

interface SummarizeButtonProps {
    noteId: string;
    content: string;
    onSummaryGenerated: (summary: string) => void;
    setIsSummarizing: (summarizationState: boolean) => void;
    disabled?: boolean;
}

const SummarizeButton = ({
    noteId,
    content,
    onSummaryGenerated,
    setIsSummarizing,
    disabled
}: SummarizeButtonProps) => {

    const handleSummarize = async () => {
        setIsSummarizing(true);

        if (!content.trim()) {
            createToast('error', 'Cannot summarize empty content');
            setIsSummarizing(false);
            return;
        }

        try {
            const response = await puter.ai.chat(`Summarize the following note concisely and expertly while preserving the key points and answering any questions:\n\n${content}`);

            let summary: unknown = '';
            if (typeof response === 'string') {
                summary = response;
            } else if (response) {
                summary = response.message?.content || JSON.stringify(response);
            }

            if (!summary) {
                createToast("error", "Error creating summary");
            }

            await createNoteSummary(noteId, summary as string);

            onSummaryGenerated(summary as string);

            setIsSummarizing(false);

            createToast('success', 'Note summarized successfully!');
        } catch (error) {
            console.error('Summarization error:', error);
            createToast('error', error instanceof Error ? error.message : 'Failed to summarize note');
        }
    };

    return (
        <button
            type="button"
            onClick={handleSummarize}
            aria-busy={disabled || !content.trim() || content.trim().length === 0}
            disabled={disabled || !content.trim() || content.trim().length === 0}
            className="group relative inline-flex items-center justify-center px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute -inset-px rounded-lg bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300"></div>

            <div className="relative flex items-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <span className="bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-semibold flex items-center gap-1.5">
                    <Sparkles className="size-4 text-cyan-300" />
                    {disabled ? 'Summarizing...' : 'Summarize'}
                </span>
            </div>
        </button>
    )
}

export default SummarizeButton