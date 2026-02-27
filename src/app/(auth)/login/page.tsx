'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError(null);
        try {
            const { data: session, error: authError } = await signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: "/dashboard",
                fetchOptions: {
                    onError(ctx) {
                        if (ctx.error.status === 401 || ctx.error.code === 'INVALID_EMAIL_OR_PASSWORD') {
                            setError("Invalid email or password. Please try again.");
                        } else {
                            setError(ctx.error.message || "An error occurred during sign in");
                        }
                    },
                },
            });

            if (!authError && session) {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-serif text-surface-900 mb-1">Welcome Back</h1>
                <p className="text-sm text-surface-800 font-light">Enter your credentials to access your curriculum.</p>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
                <button
                    onClick={() => signIn.social({ provider: 'google', callbackURL: '/dashboard' })}
                    className="w-full flex items-center justify-center gap-3 bg-surface-50 border border-surface-200 text-surface-900 px-4 py-3 rounded-2xl font-medium hover:bg-surface-100 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-surface-200"></div>
                <span className="flex-shrink-0 mx-4 text-surface-500 text-xs uppercase tracking-widest font-medium">Or</span>
                <div className="flex-grow border-t border-surface-200"></div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-800 ml-1 block">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="student@university.edu"
                        {...register('email')}
                        className={`w-full bg-surface-50 border ${errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-surface-200'} text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all font-light placeholder-surface-400`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-end ml-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-800 block">Password</label>
                        <Link href="#" className="text-xs text-brand-600 hover:text-brand-800 font-medium pb-0.5">Forgot?</Link>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        className={`w-full bg-surface-50 border ${errors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-surface-200'} text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all font-light placeholder-surface-400`}
                    />
                    {errors.password && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-900 text-surface-50 px-6 py-3.5 rounded-2xl font-medium shadow-float hover:bg-brand-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-2 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign In to Workspace"
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-surface-800 font-light pt-2">
                Don't have an account? <Link href="/register" className="font-medium text-brand-700 hover:text-brand-900 transition-colors">Create one here.</Link>
            </p>
        </div>
    );
}
