'use client'

import { useState, useCallback } from 'react';
import { Upload, X, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadMaterial } from '@/app/actions/uploadMaterial';
import { cn } from '@/lib/utils';

export function FileUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) validateAndSetFile(droppedFile);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file: File) => {
        setStatus(null);
        const validTypes = ['application/pdf', 'text/plain'];
        if (!validTypes.includes(file.type)) {
            setStatus({ type: 'error', message: 'Only PDF and TXT files are supported' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setStatus({ type: 'error', message: 'File size must be less than 10MB' });
            return;
        }
        setFile(file);
    };

    const removeFile = () => {
        setFile(null);
        setStatus(null);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setIsUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadMaterial(formData);
            if (result.success) {
                setStatus({ type: 'success', message: result.warning || 'Material uploaded and indexed successfully!' });
                setFile(null);
            } else {
                setStatus({ type: 'error', message: result.error || 'Upload failed' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div
                className={cn(
                    "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center text-center overflow-hidden",
                    isDragging
                        ? "border-brand-500 bg-brand-50 scale-[1.01]"
                        : "border-brand-300 bg-brand-50/50 hover:bg-brand-50",
                    file && "border-solid border-brand-400 bg-brand-50"
                )}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !file && document.getElementById('file-upload')?.click()}
            >
                {/* Decorative background blobs */}
                <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-brand-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-300 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                />

                {!file ? (
                    <>
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-600 mb-6 shadow-float group-hover:scale-110 transition-transform z-10">
                            <svg className="w-10 h-10 transform -translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                </path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif text-surface-900 mb-2 z-10">
                            Drop materials here to expand your AI&apos;s brain
                        </h2>
                        <p className="text-surface-800 font-light max-w-lg mb-8 z-10">
                            Upload PDFs or text files. The AI will instantly vectorize and learn the contents to provide targeted tutoring.
                        </p>
                        <button
                            type="button"
                            className="bg-brand-900 text-surface-50 px-8 py-3.5 rounded-2xl font-medium shadow-float hover:bg-brand-800 transition-colors z-10"
                        >
                            Select Files to Upload
                        </button>
                        <p className="text-xs text-surface-500 mt-4 font-mono z-10">Supported: .pdf, .txt (Max 10MB)</p>
                    </>
                ) : (
                    <div className="w-full max-w-md space-y-4 z-10">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-surface-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${file.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-surface-200 text-surface-700'
                                    }`}>
                                    <span className="font-bold text-xs">
                                        {file.name.split('.').pop()?.toUpperCase() || 'TXT'}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-surface-900 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-surface-500 font-light">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="p-2 hover:bg-surface-100 rounded-xl transition-colors"
                            >
                                <X className="h-5 w-5 text-surface-500" />
                            </button>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                            disabled={isUploading}
                            className="w-full h-14 rounded-2xl bg-brand-900 text-surface-50 font-medium flex items-center justify-center gap-3 hover:bg-brand-800 transition-all disabled:opacity-50 shadow-float"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Vectorizing & Indexing...
                                </>
                            ) : (
                                'Upload & Index Material'
                            )}
                        </button>
                    </div>
                )}
            </div>

            {status && (
                <div className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border",
                    status.type === 'success'
                        ? "bg-green-50 border-green-200 text-green-900"
                        : "bg-red-50 border-red-200 text-red-900"
                )}>
                    {status.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <p className="text-sm font-medium">{status.message}</p>
                </div>
            )}
        </div>
    );
}
