import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// We conditionally configure the WebSocket constructor because the 'ws' package 
// is Node.js specific and will cause "fetch failed" / "WebSocket is not defined" 
// errors in the Edge Runtime (e.g., Next.js Middleware).
if (process.env.NEXT_RUNTIME !== "edge" && typeof window === "undefined") {
    // We are in a Node.js environment
    // Use dynamic import to avoid static analyzability issues in Edge builds
    import('ws').then((ws) => {
        neonConfig.webSocketConstructor = ws.default;
    });
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

// We use the Neon Driver Adapter universally to provide stable connections 
// and Edge Runtime compatibility across all environments.
if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is missing in environment variables.");
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);

    globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
}

prisma = globalForPrisma.prisma;

export const db = prisma;
