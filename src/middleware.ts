import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        const session = response.ok ? await response.json() : null;

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
