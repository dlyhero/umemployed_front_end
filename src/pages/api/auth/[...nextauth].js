import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import baseUrl from "@/src/app/api/baseUrl";

export const authOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${baseUrl}/users/login/`,
            {
              email: credentials.email,
              password: credentials.password
            },
            {
              headers: { "Content-Type": "application/json" },
              validateStatus: (status) => status === 403 || status < 400
            }
          );

          if (response.status === 403) throw new Error("EMAIL_NOT_VERIFIED");
          if (response.status !== 200) throw new Error("INVALID_CREDENTIALS");

          return {
            email: response.data.email || credentials.email,
            name: response.data.name || credentials.email.split('@')[0],
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            role: response.data.role || 'none',
            has_resume: response.data.has_resume || false,
            has_company: response.data.has_company || false,
            company_id: response.data.company_id || null,
            user_id: response.data.user_id
          };
        } catch (error) {
          console.error("Error:", error);
          if (error.message === 'EMAIL_NOT_VERIFIED') {
            throw new Error('EMAIL_NOT_VERIFIED');
          } else if (error.status === 400) {
            throw new Error('INVALID_CREDENTIALS');
          } else {
            throw new Error('Please make sure you are connected to the internet');
          }
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 0,
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "auth/error",
    OfflinePage: "/offline",
  },
 // authOptions.j
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = user.role || 'none';
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.has_resume = user.has_resume;
        token.has_company = user.has_company;
        token.company_id = user.company_id;
        token.user_id = user.user_id;
      }
      
      // Update token when session is updated (e.g., after role selection)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
        token.has_resume = session.has_resume;
        token.has_company = session.has_company;
        token.company_id = session.company_id;
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.name = token.name || session.user.name;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.has_resume = token.has_resume;
      session.user.has_company = token.has_company;
      session.user.company_id = token.company_id;
      session.user.user_id = token.user_id;
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle callback URLs after login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },  
};

export default NextAuth(authOptions);