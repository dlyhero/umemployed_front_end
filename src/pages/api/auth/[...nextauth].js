import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

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
            "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/login/",
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

          console.log(response.data.access)

          return {
            email: response.data.email || credentials.email,
            name: response.data.name || credentials.email.split('@')[0], // Fallback to email prefix
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
            role: response.data.role || 'none'
          };
        } catch (error) {
          console.error("Error:", error);
          // Throw specific errors that will be caught in the NextAuth error page
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
    error: "/auth/error", // Custom error page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'none';
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Copy token properties to session
      console.log(session);
      session.user.role = token.role;
      session.user.name = token.name || session.user.name; // Preserve from provider if exists
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to select-role if no role is assigned
      if (url === baseUrl) {
        return `${baseUrl}/select-role`;
      }
      return url;
    }
  },
};

export default NextAuth(authOptions);
