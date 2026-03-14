import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        pages: {
            signIn: "/sign-in",
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/explore/:path*",
        "/analyze/:path*",
        "/opensource/:path*",
        "/contributors/:path*",
        "/ai/:path*",
    ],
};
