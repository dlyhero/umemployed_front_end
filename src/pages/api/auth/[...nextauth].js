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
          
          return {
            email: response.data.email || credentials.email,
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
            role: response.data.role || 'none'
          };
        } catch (error) {
          if (error.response?.status === 403) throw new Error("EMAIL_NOT_VERIFIED");
          throw new Error("INVALID_CREDENTIALS");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),   
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
    // Remove the redirect callback completely
    // We'll handle redirects manually in the client
  },
};

export default NextAuth(authOptions);