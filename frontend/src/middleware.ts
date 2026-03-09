export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/explore/:path*",
        "/analyze/:path*",
        "/opensource/:path*",
        "/contributors/:path*",
    ],
};
