'use client'

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
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
                setStatus({ type: 'success', message: 'Material uploaded and processed successfully!' });
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
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div
                className={cn(
                    "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-12",
                    isDragging
                        ? "border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800/50"
                        : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/50",
                    file && "border-solid border-zinc-900 dark:border-zinc-50"
                )}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !file && document.getElementById('file-upload')?.click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    {!file ? (
                        <>
                            <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Upload Study Material</h3>
                                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    Drag and drop your PDF or TXT files here, or click to browse
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> PDF up to 10MB
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> Plain Text (.txt)
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm">
                                        <FileText className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[200px]">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-zinc-500" />
                                </button>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                                disabled={isUploading}
                                className="w-full h-14 rounded-2xl bg-zinc-900 text-white font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing Material...
                                    </>
                                ) : (
                                    'Upload & Parse'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {status && (
                <div className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300",
                    status.type === 'success'
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400"
                        : "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
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
