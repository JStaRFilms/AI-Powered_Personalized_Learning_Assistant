import { getCachedSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
    const session = await getCachedSession();

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

            <SettingsForm
                userName={session.user.name || ""}
                userEmail={session.user.email || ""}
            />
        </div>
    );
}
