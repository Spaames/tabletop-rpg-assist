import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//for logout, if the cookie has expired ---> /logout
export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken');

    if (!token) {
        return NextResponse.redirect(new URL('/logout', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home"],
}