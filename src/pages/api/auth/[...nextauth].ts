import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { DefaultSession } from 'next-auth';

// Kullanıcı tipini genişlet
declare module "next-auth" {
    interface User {
        userType: string;
    }
    interface Session {
        user: {
            id: string;
            userType: string;
        } & DefaultSession["user"]
    }
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Şifre", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email ve şifre gereklidir');
                }

                // Kullanıcıyı Supabase'den al
                const { data: user } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                    throw new Error('Email veya şifre hatalı');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    userType: user.type
                };
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userType = user.userType;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.userType = token.userType as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    }
}); 