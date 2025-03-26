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
              password: credentials.password
            },
            {
              headers: { "Content-Type": "application/json" },
              validateStatus: (status) => status === 403 || status < 400 // Allow 403 through
            }
          );
      
          // Handle unverified email (403)
          if (response.status === 403) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }
      
          // Successful login
          if (response.status === 200) {
            return {
              email: credentials.email,
              accessToken: response.data.access,
              refreshToken: response.data.refresh
            };
          }
      
          // All other cases (including 400/401)
          throw new Error("INVALID_CREDENTIALS");
      
        } catch (error) {
          // Preserve 403 error
          if (error.response?.status === 403) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }
          throw error;
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),   
  ],
  debug: true,
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
    async jwt({ token, user, account, error }) {
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
              { timeout: 10000 }
            );
    
            if (response.data?.access) {
              token.accessToken = response.data.access;
              token.refreshToken = response.data.refresh;
              token.email = user.email;
            }
          } catch (error) {
            console.error("Google auth failed:", error.response?.data || error.message);
            // Propagate Google auth errors
            token.error = "GOOGLE_AUTH_FAILED";
          }
        }
    
        // Handle credentials provider
        if (account.provider === "credentials") {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.email = user.email;
          
          // If there was an error during credentials auth (like unverified email)
          if (error) {
            token.error = error; // This will contain "EMAIL_NOT_VERIFIED" or "INVALID_CREDENTIALS"
          }
        }
      }
      
      // If there was an error but not during initial sign in
      if (error) {
        token.error = error;
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
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      if (account.provider === "google") {
        return true;
      }
      return true;
    }
 
  },
};

export default NextAuth(authOptions);
