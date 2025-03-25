import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions = {
  providers: [
    // Credentials provider for email/password login
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
              timeout: 10000, // Set timeout for the request (10 seconds)
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

    // Google provider for OAuth login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: "https://accounts.google.com/o/oauth2/auth",
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://www.googleapis.com/oauth2/v2/userinfo",
      httpOptions: {
        timeout: 10000, // Set timeout to 10 seconds (10000ms)
      },
    }),    
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login", // Custom sign-in page
    signOut: "/",
  },
  callbacks: {
    // Handling JWT and token persistence
    async jwt({ token, user, account }) {
      // On initial sign in
      if (account && user) {
        // Handle Google provider
        if (account.provider === "google") {
          try {
            const response = await axios.post(
              "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/google-auth/",
              {
                access_token: account.access_token,
                id_token: account.id_token,
              },
              { timeout: 10000 } // Set timeout for the request (10 seconds)
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

    // Handling session updates
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.email = token.email;
      session.error = token.error; // For error propagation
      return session;
    },

    // Redirect after successful login
    async redirect({ url, baseUrl }) {
      if (url === baseUrl + "/login") {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    // Sign-in verification
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Additional verification can be done here
        return true;
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
