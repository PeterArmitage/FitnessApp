// components/Sidebar/Sidebar.tsx
'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';

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
	{ icon: 'FaHistory', name: 'Logs', href: '/dashboard/logs' }, // New Logs section
];

export default function Sidebar() {
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		router.push('/');
	};

	return (
		<nav className='w-64 h-screen flex flex-col bg-white/10 dark:bg-black/10 backdrop-blur-md border-r border-gray-200 dark:border-white/20'>
			<div className='p-4 flex justify-between items-center border-b border-gray-200 dark:border-white/20'>
				<h2 className='text-2xl font-bold'>Fitness App</h2>
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
		</nav>
	);
}
