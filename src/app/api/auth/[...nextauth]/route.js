import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const utente = await prisma.utente.findUnique({
          where: { email: credentials.email },
        });

        if (!utente) return null;

        const passwordCorretta = await bcrypt.compare(
          credentials.password,
          utente.password
        );

        if (!passwordCorretta) return null;

        return {
          id: utente.id,
          email: utente.email,
          nome: utente.nome,
        };
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.nome = user.nome;
    }
    return token;
  },
  async session({ session, token }) {
    if (token) {
      session.user.nome = token.nome;
    }
    return session;
  },
},
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };