import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
    try {
        // Direct session access avoids internal HTTP round-trip latency (~2 seconds)
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/chat");
        const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

        if (isProtectedRoute && !session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (isAuthRoute && session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware session check failed:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
