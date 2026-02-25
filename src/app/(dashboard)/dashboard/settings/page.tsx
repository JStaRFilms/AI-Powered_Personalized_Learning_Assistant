import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto">
            <header>
                <span className="text-xs uppercase tracking-widest text-surface-800 font-medium mb-1 block">
                    Account
                </span>
                <h1 className="text-4xl font-serif text-surface-900 leading-none">Settings & Profile</h1>
            </header>

            <div className="space-y-10">
                {/* Profile Section */}
                <section className="glass p-8 rounded-3xl shadow-soft">
                    <h3 className="text-lg font-serif text-surface-900 border-b border-surface-200 pb-4 mb-6">
                        Personal Information
                    </h3>

                    <div className="flex items-center gap-8 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-surface-200 flex items-center justify-center font-serif text-4xl text-surface-900 border-4 border-white shadow-sm">
                                {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "S"}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-medium text-surface-900 mb-1">{session.user.name || "Student"}</h4>
                            <p className="text-surface-800 font-light text-sm mb-3">{session.user.email}</p>
                            <span className="text-xs font-medium text-brand-800 bg-brand-100 px-3 py-1 rounded-full">
                                Pro Plan
                            </span>
                        </div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-surface-800 ml-1 block">Full Name</label>
                            <input type="text" defaultValue={session.user.name || ""}
                                className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-light" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-surface-800 ml-1 block">Email Address</label>
                            <input type="email" defaultValue={session.user.email || ""}
                                className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-light"
                                disabled />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1 mt-2">
                            <label className="text-xs font-medium text-surface-800 ml-1 block">Bio / Major Focus</label>
                            <textarea rows={3}
                                className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-light resize-none"
                                defaultValue="Mathematics major focusing on advanced calculus and statistics." />
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                            <button type="button"
                                className="bg-brand-900 text-surface-50 px-6 py-3 rounded-2xl font-medium shadow-float hover:bg-brand-800 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </section>

                {/* AI Preferences */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="glass p-8 rounded-3xl shadow-soft h-full">
                        <h3 className="text-lg font-serif text-surface-900 border-b border-surface-200 pb-4 mb-6">
                            AI Preferences
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-sm font-medium text-surface-900">Socratic Method</h5>
                                    <p className="text-xs text-surface-800 font-light mt-0.5">
                                        AI asks leading questions instead of giving direct answers.
                                    </p>
                                </div>
                                <div className="w-12 h-6 bg-brand-500 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-sm font-medium text-surface-900">Strict Curriculum Mode</h5>
                                    <p className="text-xs text-surface-800 font-light mt-0.5">
                                        AI will aggressively refuse to answer non-uploaded topics.
                                    </p>
                                </div>
                                <div className="w-12 h-6 bg-brand-500 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border border-red-200 bg-red-50/30 p-8 rounded-3xl h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-serif text-red-900 border-b border-red-200 pb-4 mb-6">
                                Danger Zone
                            </h3>
                            <p className="text-sm text-red-800 font-light mb-4">
                                Deleting your account will permanently wipe all uploaded documents, chat histories, and mastery tracking. This action cannot be undone.
                            </p>
                        </div>
                        <div>
                            <button className="bg-red-500 text-white px-6 py-3 rounded-2xl font-medium shadow-sm hover:bg-red-600 transition-colors w-full">
                                Delete Account Data
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
