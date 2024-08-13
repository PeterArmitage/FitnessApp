'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function SignUp() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			});

			if (response.ok) {
				toast.success('Account created successfully!');
				router.push('/signin');
			} else {
				const data = await response.json();
				toast.error(data.error || 'Something went wrong');
			}
		} catch (error) {
			toast.error('An error occurred. Please try again.');
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 dark:from-gray-900 dark:to-purple-900 text-white'>
			<form
				onSubmit={handleSubmit}
				className='w-full max-w-md space-y-4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'
			>
				<h2 className='text-2xl font-bold text-center text-gray-800 dark:text-white'>
					Sign Up
				</h2>
				<Input
					type='text'
					placeholder='Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='text-gray-800 dark:text-white'
					required
				/>
				<Input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='text-gray-800 dark:text-white'
					required
				/>
				<Input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='text-gray-800 dark:text-white'
					required
				/>
				<Button type='submit' className='w-full'>
					Sign Up
				</Button>
			</form>
		</div>
	);
}
