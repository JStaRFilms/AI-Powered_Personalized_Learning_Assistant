"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signUp } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setError(null);
        try {
            const { data: session, error: authError } = await signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                callbackURL: "/dashboard",
                fetchOptions: {
                    onError(ctx) {
                        setError(ctx.error.message || "An error occurred during registration");
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
                <h1 className="text-2xl font-serif text-surface-900 mb-1">Create Account</h1>
                <p className="text-sm text-surface-800 font-light">Join Lumina.ai for targeted learning and tutoring.</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-800 ml-1 block">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className={`w-full bg-surface-50 border ${errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-surface-200'} text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all font-light placeholder-surface-400`}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-800 ml-1 block">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="student@university.edu"
                        {...register("email")}
                        className={`w-full bg-surface-50 border ${errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-surface-200'} text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all font-light placeholder-surface-400`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-800 ml-1 block">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
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
                            Creating account...
                        </>
                    ) : (
                        "Start Learning Now"
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-surface-800 font-light pt-2">
                Already have an account? <Link href="/login" className="font-medium text-brand-700 hover:text-brand-900 transition-colors">Sign in here.</Link>
            </p>
        </div>
    );
}
