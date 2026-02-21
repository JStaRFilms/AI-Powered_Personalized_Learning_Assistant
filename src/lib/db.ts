import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    prisma = new PrismaClient({ adapter });
} else {
    // In development, avoid the WebSocket adapter to prevent ECONNRESET due to idle connections
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
            log: ["query", "error", "warn"],
        });
    }
    prisma = globalForPrisma.prisma;
}

export const db = prisma;
