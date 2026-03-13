import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email.split("@")[0], // Fallback username
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.username = (user as { username?: string }).username;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { username?: string }).username = token.username as string;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      if (!user.email) return;
      try {
        // We only send email if credentials are provided in .env
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
          console.log("Skipping welcome email: EMAIL_USER or EMAIL_PASS not set in .env.local");
          return;
        }

        const transporter = await import('nodemailer').then(m => m.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }));

        await transporter.sendMail({
          from: `"DevTrack" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Welcome to DevTrack!",
          html: `<div style="font-family: sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #6d28d9;">Welcome to DevTrack, ${user.name || "Developer"}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for signing in with your GitHub account. We're incredibly excited to have you on board!</p>
            <p style="font-size: 16px; line-height: 1.5;">With DevTrack Pro, you can instantly seamlessly scan GitHub profiles to detect AI-generated code patterns, analyze post-merge stability, and gauge true software authorship confidence.</p>
            <br/>
            <p style="font-size: 16px; color: #555;">Ready to decode developer DNA?</p>
            <a href="${process.env.NEXTAUTH_URL}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Start Scanning Now</a>
            <br/><br/>
            <p style="font-size: 14px; color: #888;">Best,<br/>The DevTrack Team</p>
          </div>`
        });

        console.log("Welcome email sent successfully to", user.email);
      } catch (error) {
        console.error("Email sending error:", error);
      }
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };