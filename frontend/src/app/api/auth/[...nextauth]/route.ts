import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

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
          username: profile.login, // Attach the GitHub username
        };
      },
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user is the object returned from the provider profile() callback above
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).username = token.username;
      }
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      try {
        await fetch("https://f4ad-103-97-165-15.ngrok-free.app/webhook/github_login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name
          })
        });
      } catch (error) {
        console.error("Webhook error:", error);
      }
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };