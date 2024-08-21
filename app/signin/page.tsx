/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

export default function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
			callbackUrl: '/dashboard',
		});
		if (result?.error) {
			console.error('Sign in error:', result.error);
		} else if (result?.url) {
			router.push(result.url);
		}
	};

	const handleGoogleSignIn = async () => {
		const result = await signIn('google', {
			redirect: false,
			callbackUrl: '/dashboard',
		});
		if (result?.error) {
			console.error('Google sign in error:', result.error);
		} else if (result?.url) {
			router.push(result.url);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
				<Input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button type='submit' className='w-full'>
					Sign In
				</Button>
			</form>
			<Button
				onClick={handleGoogleSignIn}
				className='mt-4 flex items-center justify-center'
			>
				<FcGoogle className='mr-2 h-5 w-5' /> Sign In with Google
			</Button>
			<p className='mt-4'>
				Don't have an account?{' '}
				<Link href='/signup' className='text-blue-500 hover:underline'>
					Sign up here
				</Link>
			</p>
		</div>
	);
}
