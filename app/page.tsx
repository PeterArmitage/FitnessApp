// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<div className='absolute top-4 right-4'>
				<ThemeToggle />
			</div>
			<h1 className='text-6xl font-bold mb-8'>Welcome to FitnessApp</h1>
			<p className='text-xl mb-8 text-center max-w-2xl'>
				Track your workouts, monitor your diet, and achieve your fitness goals
				with our comprehensive fitness platform.
			</p>
			<div className='space-x-4'>
				<Button asChild>
					<Link href='/signin'>Sign In</Link>
				</Button>
				<Button
					asChild
					variant='outline'
					className='bg-transparent hover:bg-white/20 dark:hover:bg-white/10'
				>
					<Link href='/signup'>Sign Up</Link>
				</Button>
			</div>
		</div>
	);
}
