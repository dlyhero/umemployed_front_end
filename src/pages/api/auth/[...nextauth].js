import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import baseUrl from "./baseUrl";
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
             
          const response = await baseUrl({
            url: "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/login/",
            data: { email, password }
          });
          
          const accessToken = response.data?.access;
          const refreshToken = response.data?.refresh;

          if (accessToken) {
            return {
              email,
              accessToken,
              refreshToken, 
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
  pages: {
    signIn: "/login",
    signOut: "/"
  }
};

export default NextAuth(authOptions);
