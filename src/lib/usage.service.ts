import { db } from "./db";

export class RateLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RateLimitError";
    }
}

export class TokenLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TokenLimitError";
    }
}

const DEFAULT_API_LIMIT = 50; // Requests per day
const DEFAULT_TOKEN_LIMIT = 200000; // Tokens per month

/**
 * Checks if limits need to be reset based on time.
 * Daily for API calls. Monthly for Tokens.
 */
async function ensureLimitsAreCurrent(usage: any) {
    const now = new Date();
    let needsUpdate = false;
    let updateData: any = {};

    // Reset API limits daily
    const apiResetDelta = now.getTime() - usage.lastApiReset.getTime();
    if (apiResetDelta > 24 * 60 * 60 * 1000) {
        updateData.apiCallsCount = 0;
        updateData.lastApiReset = now;
        needsUpdate = true;
    }

    // Reset Token limits monthly (30 days for simplicity)
    const tokenResetDelta = now.getTime() - usage.lastTokenReset.getTime();
    if (tokenResetDelta > 30 * 24 * 60 * 60 * 1000) {
        updateData.tokensUsed = 0;
        updateData.lastTokenReset = now;
        needsUpdate = true;
    }

    if (needsUpdate) {
        return await db.userUsage.update({
            where: { id: usage.id },
            data: updateData,
        });
    }

    return usage;
}

/**
 * Gets or creates the usage record for a user.
 */
export async function getUserUsage(userId: string) {
    let usage = await db.userUsage.findUnique({
        where: { userId },
    });

    if (!usage) {
        usage = await db.userUsage.create({
            data: {
                userId,
                apiLimit: DEFAULT_API_LIMIT,
                tokenLimit: DEFAULT_TOKEN_LIMIT,
            },
        });
    }

    return ensureLimitsAreCurrent(usage);
}

/**
 * Check if the user can make an API call, and increment the counter if they can.
 * Throws RateLimitError or TokenLimitError if limits are exceeded.
 */
export async function checkAndIncrementApiLimit(userId: string) {
    const usage = await getUserUsage(userId);

    if (usage.apiCallsCount >= usage.apiLimit) {
        throw new RateLimitError(`Daily API call limit of ${usage.apiLimit} exceeded.`);
    }

    if (usage.tokensUsed >= usage.tokenLimit) {
        throw new TokenLimitError(`Monthly token limit of ${usage.tokenLimit} exceeded.`);
    }

    await db.userUsage.update({
        where: { id: usage.id },
        data: {
            apiCallsCount: { increment: 1 },
        },
    });

    return true;
}

/**
 * Updates the user's token usage after a successful completion.
 */
export async function updateTokenUsage(userId: string, tokensToAdd: number) {
    if (tokensToAdd <= 0) return;

    await db.userUsage.update({
        where: { userId },
        data: {
            tokensUsed: { increment: tokensToAdd },
        },
    });
}
