import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define types for our callbacks
interface CustomToken extends JWT {
  accessToken?: string;
}

// Define a type for the OAuth account
interface OAuthAccount {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token?: string;
  token_type?: string;
  scope?: string;
  expires_at?: number;
}

// Define the auth configuration
const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: CustomToken; account: OAuthAccount | null }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: CustomToken }) {
      // Add the accessToken to the session
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/error",
  },
};

// @ts-expect-error - NextAuth call type error
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
