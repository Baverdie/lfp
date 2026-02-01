import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true, member: true },
        });

        if (!user || !user.password) {
          throw new Error('Email ou mot de passe incorrect');
        }

        if (!user.isActive) {
          throw new Error('Ce compte a été désactivé');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Mettre à jour la date de dernière connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        console.log('[AUTH] Login success for:', user.email);
        console.log('[AUTH] Role:', user.role.name);
        console.log('[AUTH] Permissions from DB:', user.role.permissions);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role.name,
          permissions: user.role.permissions,
          memberId: user.memberId,
          memberPhoto: user.member?.photo || null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('[JWT] Setting token from user, permissions:', user.permissions);
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.memberId = user.memberId;
        token.memberPhoto = user.memberPhoto;
        // Marquer que l'utilisateur vient de se connecter
        token.justLoggedIn = true;
      }
      console.log('[JWT] Token permissions:', token.permissions);
      return token;
    },
    async session({ session, token }) {
      console.log('[SESSION] Token permissions:', token.permissions);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.user.memberId = token.memberId as string | null;
        session.user.memberPhoto = token.memberPhoto as string | null;
        // Passer le flag de login à la session
        (session as any).justLoggedIn = token.justLoggedIn;
        console.log('[SESSION] Final session permissions:', session.user.permissions);
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
