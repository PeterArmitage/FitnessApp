import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
				remember: { label: 'Remember Me', type: 'checkbox' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user.password) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
				};
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user, account }) {
			console.log('JWT callback', { token, user, account });
			if (user) {
				token.id = user.id;
			}
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			console.log('Session callback', { session, token });
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			console.log('Redirect callback', { url, baseUrl });
			// Always redirect to /dashboard after successful sign in
			return `${baseUrl}/dashboard`;
		},
		async signIn({ user, account, profile, email, credentials }) {
			console.log('Sign in callback', {
				user,
				account,
				profile,
				email,
				credentials,
			});

			if (account?.provider === 'google') {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email! },
				});

				if (existingUser) {
					// Check if the Google account is already linked
					const existingAccount = await prisma.account.findFirst({
						where: {
							userId: existingUser.id,
							provider: 'google',
						},
					});

					if (!existingAccount) {
						// Link the Google account to the existing user
						await prisma.account.create({
							data: {
								userId: existingUser.id,
								type: account.type,
								provider: account.provider,
								providerAccountId: account.providerAccountId,
								access_token: account.access_token,
								expires_at: account.expires_at,
								token_type: account.token_type,
								scope: account.scope,
								id_token: account.id_token,
							},
						});
					}
					return true;
				}
			}
			return true;
		},
	},
	pages: {
		signIn: '/signin',
	},
};
