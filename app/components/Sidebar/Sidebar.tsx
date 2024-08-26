'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const menuItems = [
	{ icon: 'FaChartBar', name: 'Overview', href: '/dashboard' },
	{
		icon: 'FaDumbbell',
		name: 'Exercise Library',
		href: '/dashboard/exercises',
	},
	{ icon: 'FaUtensils', name: 'Food Diary', href: '/dashboard/food' },
	{ icon: 'FaUser', name: 'Workout Log', href: '/dashboard/trainer' },
	{ icon: 'FaBed', name: 'Sleep and Recovery', href: '/dashboard/sleep' },
	{ icon: 'FaHistory', name: 'Logs', href: '/dashboard/logs' },
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		router.push('/');
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const SidebarContent = () => (
		<>
			<div className='p-4 flex justify-between items-center border-b border-gray-200 dark:border-white/20'>
				<h2 className='text-2xl font-bold'>Fit Forge</h2>
				<ThemeToggle />
			</div>
			<ul className='mt-8 flex-grow'>
				{menuItems.map((item) => (
					<SidebarItem key={item.name} {...item} />
				))}
			</ul>
			<div className='p-4 border-t border-gray-200 dark:border-white/20'>
				<Button
					onClick={handleSignOut}
					className='w-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-white/10 dark:text-white light:text-black'
				>
					<LogOut className='mr-2 h-4 w-4' />
					Sign Out
				</Button>
			</div>
		</>
	);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<AnimatePresence>
				{open && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
							onClick={() => setOpen(false)}
						/>
						<motion.div
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{ duration: 0.3 }}
							className='fixed inset-y-0 left-0 flex w-full max-w-xs flex-1 flex-col bg-gradient-light dark:bg-gradient-dark z-50 lg:hidden'
						>
							<div className='absolute top-0 right-0 -mr-12 pt-2'>
								<button
									type='button'
									className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
									onClick={() => setOpen(false)}
								>
									<span className='sr-only'>Close sidebar</span>
									<X className='h-6 w-6 text-white' aria-hidden='true' />
								</button>
							</div>
							<div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
								<SidebarContent />
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Static sidebar for desktop */}
			<div className='hidden lg:flex lg:flex-shrink-0'>
				<div className='flex w-64 flex-col'>
					<div className='flex min-h-0 flex-1 flex-col bg-gradient-light dark:bg-gradient-dark'>
						<div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
							<SidebarContent />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
