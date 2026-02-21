import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function UploadPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Add New Materials
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Upload your course PDFs or notes. We'll extract the core concepts so you can start chatting with them.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <FileUploader />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                            PDF Guidelines
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Ensure your PDFs are text-based and not scanned images. We currently support documents up to 10MB in size.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                            Next Steps
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            After uploading, our AI will index your content. You can then head over to the Chat section to ask questions about it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
