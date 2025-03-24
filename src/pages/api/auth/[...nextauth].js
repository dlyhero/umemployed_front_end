import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn, signOut } from "next-auth/react";

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
          const response = await fetch("https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/login/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data?.detail || "Login failed");
          }

          return {
            email,
            accessToken: data.access,
            refreshToken: data.refresh,
          };
        } catch (error) {
          console.error("Login failed:", error.message);
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
  pages: {
    signIn: "/login",
    signOut: "/",
  },
};

export default NextAuth(authOptions);
