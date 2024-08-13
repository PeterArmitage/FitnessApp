/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
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
				onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
				className='mt-4'
			>
				Sign In with Google
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
