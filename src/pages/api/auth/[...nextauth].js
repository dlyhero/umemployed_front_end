import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
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
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Handle Google provider
        if (account.provider === "google") {
          try {
            // Send Google credentials to your backend
            const response = await axios.post(
              "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/google-auth/",
              {
                access_token: account.access_token,
                id_token: account.id_token
              }
            );

            if (response.data?.access) {
              token.accessToken = response.data.access;
              token.refreshToken = response.data.refresh;
            }
          } catch (error) {
            console.error("Google auth failed:", error.response?.data || error.message);
          }
        }
        
        // Handle credentials provider
        if (account.provider === "credentials") {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.email = token.email;
      session.error = token.error; // For error propagation
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home after login, replacing history
      if (url === baseUrl + "/login") {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Additional verification can be done here
        return true;
      }
      return true;
    }
  },
};

export default NextAuth(authOptions);