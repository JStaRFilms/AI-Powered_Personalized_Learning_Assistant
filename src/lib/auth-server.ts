import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * A cached version of the session fetch that deduplicates multiple calls 
 * within the same request lifecycle (e.g., Layout and Page).
 */
export const getCachedSession = cache(async () => {
    try {
        return await auth.api.getSession({
            headers: await headers(),
        });
    } catch (error) {
        console.error("Failed to get cached session:", error);
        return null;
    }
});
