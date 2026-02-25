import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FileUploader } from "@/components/dashboard/file-uploader";

export default async function LibraryPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const documents = await db.document.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-xs uppercase tracking-widest text-surface-800 font-medium mb-1 block">
                        Curriculum Management
                    </span>
                    <h1 className="text-4xl font-serif text-surface-900 leading-none">Your Library</h1>
                </div>

                <div className="flex gap-4">
                    <div className="relative w-64">
                        <input type="text" placeholder="Search materials..."
                            className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-light placeholder-surface-400" />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* File Uploader Component */}
            <FileUploader />

            {/* Files List Matrix */}
            <div className="glass p-8 rounded-3xl shadow-soft">
                <div className="flex justify-between items-center border-b border-surface-200 pb-4 mb-6">
                    <h3 className="text-lg font-serif text-surface-900">
                        Indexed Curriculum <span className="text-sm font-sans text-surface-500 ml-2 font-normal">({documents.length} files total)</span>
                    </h3>

                    <div className="flex gap-2">
                        <button className="p-2 text-surface-900 bg-surface-100 rounded-lg hover:bg-surface-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                                </path>
                            </svg>
                        </button>
                        <button className="p-2 text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-surface-50 border border-surface-200 p-5 rounded-2xl hover:border-brand-300 hover:shadow-float transition-all group cursor-pointer flex flex-col h-48 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${doc.title.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-surface-200 text-surface-700'}`}>
                                    <span className="font-bold text-xs">{doc.title.split('.').pop()?.toUpperCase() || 'TXT'}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-surface-900 line-clamp-2 leading-tight">{doc.title}</h4>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs text-surface-500 font-light">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-1 rounded-md">Indexed</span>
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <div className="col-span-full py-8 text-center text-surface-500">
                            No materials indexed yet. Please upload a file above.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
