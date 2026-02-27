'use client';

import { useState } from 'react';
import { deleteDocument } from '@/app/actions/deleteDocument';

interface DeleteDocButtonProps {
    documentId: string;
}

export function DeleteDocButton({ documentId }: DeleteDocButtonProps) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirming) {
            setConfirming(true);
            // Auto-dismiss confirmation after 3 seconds
            setTimeout(() => setConfirming(false), 3000);
            return;
        }

        setDeleting(true);
        const result = await deleteDocument(documentId);
        if (!result.success) {
            alert(result.error || 'Failed to delete');
        }
        setDeleting(false);
        setConfirming(false);
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleDelete();
            }}
            disabled={deleting}
            className={`absolute top-3 right-3 p-1.5 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${confirming
                    ? 'bg-red-500 text-white opacity-100 scale-100'
                    : 'bg-surface-100 text-surface-500 hover:bg-red-50 hover:text-red-500'
                }`}
            title={confirming ? 'Click again to confirm' : 'Delete document'}
        >
            {deleting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                </svg>
            )}
        </button>
    );
}
