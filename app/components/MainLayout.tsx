// components/MainLayout.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

interface MainLayoutProps {
	children: React.ReactNode;
	showAuthButtons?: boolean;
}

export function MainLayout({
	children,
	showAuthButtons = true,
}: MainLayoutProps) {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8'>
			<div className='absolute top-4 right-4'>
				<ThemeToggle />
			</div>
			{children}
			{showAuthButtons && (
				<div className='space-x-4 mt-8'>
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
			)}
		</div>
	);
}
