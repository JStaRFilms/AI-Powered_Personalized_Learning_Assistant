'use client';

import { useState, useEffect } from 'react';
import { updateProfile } from '@/app/actions/updateProfile';
import { deleteAccountData } from '@/app/actions/deleteAccountData';

interface SettingsFormProps {
    userName: string;
    userEmail: string;
}

export function SettingsForm({ userName, userEmail }: SettingsFormProps) {
    const [name, setName] = useState(userName);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [socraticMode, setSocraticMode] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('ai_preferences');
                if (saved) return JSON.parse(saved).socraticMode ?? true;
            } catch { }
        }
        return true;
    });
    const [strictCurriculumMode, setStrictCurriculumMode] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('ai_preferences');
                if (saved) return JSON.parse(saved).strictCurriculumMode ?? true;
            } catch { }
        }
        return true;
    });

    // Persist preferences to localStorage for ChatInterface to read
    useEffect(() => {
        localStorage.setItem('ai_preferences', JSON.stringify({
            socraticMode,
            strictCurriculumMode,
        }));
    }, [socraticMode, strictCurriculumMode]);

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus(null);

        const formData = new FormData();
        formData.append('name', name);

        const result = await updateProfile(formData);

        if (result.success) {
            setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
        } else {
            setSaveStatus({ type: 'error', message: result.error || 'Update failed' });
        }
        setSaving(false);

        // Auto-dismiss success message
        if (result.success) {
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        setDeleting(true);
        const result = await deleteAccountData();

        if (result.success) {
            setConfirmDelete(false);
            setSaveStatus({ type: 'success', message: 'All learning data has been deleted.' });
        } else {
            setSaveStatus({ type: 'error', message: result.error || 'Deletion failed' });
        }
        setDeleting(false);
    };

    return (
        <div className="space-y-10">
            {/* Profile Section */}
            <section className="glass p-8 rounded-3xl shadow-soft">
                <h3 className="text-lg font-serif text-surface-900 border-b border-surface-200 pb-4 mb-6">
                    Personal Information
                </h3>

                <div className="flex items-center gap-8 mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-surface-200 flex items-center justify-center font-serif text-4xl text-surface-900 border-4 border-white shadow-sm">
                            {name?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || "S"}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-medium text-surface-900 mb-1">{name || "Student"}</h4>
                        <p className="text-surface-800 font-light text-sm mb-3">{userEmail}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-surface-800 ml-1 block">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-light"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-surface-800 ml-1 block">Email Address</label>
                        <input
                            type="email"
                            defaultValue={userEmail}
                            className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-light opacity-60"
                            disabled
                        />
                    </div>
                </div>

                {/* Status Message */}
                {saveStatus && (
                    <div className={`mt-4 text-sm px-4 py-3 rounded-2xl font-light ${saveStatus.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {saveStatus.message}
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || name.trim() === userName}
                        className="bg-brand-900 text-surface-50 px-6 py-3 rounded-2xl font-medium shadow-float hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </section>

            {/* AI Preferences & Danger Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="glass p-8 rounded-3xl shadow-soft h-full">
                    <h3 className="text-lg font-serif text-surface-900 border-b border-surface-200 pb-4 mb-6">
                        AI Preferences
                    </h3>

                    <div className="space-y-6">
                        {/* Socratic Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-sm font-medium text-surface-900">Socratic Method</h5>
                                <p className="text-xs text-surface-800 font-light mt-0.5">
                                    AI asks leading questions instead of giving direct answers.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSocraticMode(!socraticMode)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors ${socraticMode ? 'bg-brand-500' : 'bg-surface-300'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${socraticMode ? 'right-1' : 'left-1'
                                    }`}></div>
                            </button>
                        </div>

                        {/* Strict Curriculum Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-sm font-medium text-surface-900">Strict Curriculum Mode</h5>
                                <p className="text-xs text-surface-800 font-light mt-0.5">
                                    AI will aggressively refuse to answer non-uploaded topics.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStrictCurriculumMode(!strictCurriculumMode)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors ${strictCurriculumMode ? 'bg-brand-500' : 'bg-surface-300'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${strictCurriculumMode ? 'right-1' : 'left-1'
                                    }`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="border border-red-200 bg-red-50/30 p-8 rounded-3xl h-full flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-serif text-red-900 border-b border-red-200 pb-4 mb-6">
                            Danger Zone
                        </h3>
                        <p className="text-sm text-red-800 font-light mb-4">
                            {confirmDelete
                                ? "Are you sure? This will permanently delete all uploaded documents, chat histories, and usage data. This cannot be undone."
                                : "Deleting your data will permanently wipe all uploaded documents, chat histories, and mastery tracking. This action cannot be undone."
                            }
                        </p>
                    </div>
                    <div>
                        {confirmDelete && (
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                className="text-sm text-surface-600 hover:text-surface-900 mb-3 block transition-colors"
                            >
                                ← Cancel
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className={`px-6 py-3 rounded-2xl font-medium shadow-sm transition-colors w-full disabled:opacity-50 ${confirmDelete
                                ? 'bg-red-700 text-white hover:bg-red-800'
                                : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                        >
                            {deleting ? 'Deleting...' : confirmDelete ? 'Yes, Delete Everything' : 'Delete Account Data'}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
