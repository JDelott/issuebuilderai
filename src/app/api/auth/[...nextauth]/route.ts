import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

interface ExtendedToken extends JWT {
  accessToken?: string;
}

interface ExtendedSession extends Session {
  accessToken?: string;
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<ExtendedToken> {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      // Send properties to the client
      const extendedSession = session as ExtendedSession;
      extendedSession.accessToken = (token as ExtendedToken).accessToken;
      return extendedSession;
    },
  },
});

export { handler as GET, handler as POST };
