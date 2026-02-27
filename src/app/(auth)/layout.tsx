import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pattern-dots flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo or App Name */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-serif font-medium tracking-tight text-surface-900 inline-block">
                        Lumina<span className="text-brand-500 italic">.ai</span>
                    </h2>
                    <p className="text-surface-800 mt-2 font-light text-sm">Targeted learning. Context-aware tutoring.</p>
                </div>

                <div className="glass p-10 rounded-3xl shadow-float border-t border-white/60">
                    {children}
                </div>
            </div>
        </div>
    );
}
