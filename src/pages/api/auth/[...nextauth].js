import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import baseUrl from "./baseUrl";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const response = await baseUrl.post("/users/login", { email, password });

          const accessToken = response.data?.access;
          const refreshToken = response.data?.refresh;

          if (accessToken) {
            return {
              email,
              accessToken,
              refreshToken, // Store refresh token as well
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Login failed:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
