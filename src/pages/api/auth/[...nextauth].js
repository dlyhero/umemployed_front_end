import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/login/",
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data?.access) {
            return {
              email: credentials.email,
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
            };
          }
          return null;
        } catch (error) {
          console.error("Login failed:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.email = token.email;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home after login, replacing history
      if (url === baseUrl + "/login") {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

export default NextAuth(authOptions);