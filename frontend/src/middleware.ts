import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/sign-in",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/explore/:path*",
        "/analyze/:path*",
        "/opensource/:path*",
        "/contributors/:path*",
    ],
};
