// app/components/Modal.tsx
'use client'
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    isNoteAdding: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, isNoteAdding, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-slideUp">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 transition-colors"
                    aria-label="Close"
                    disabled={isNoteAdding}
                >
                    <X className='size-6' />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;