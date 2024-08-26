'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className='flex h-screen overflow-hidden'>
			<Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<header className='bg-gradient-light dark:bg-gradient-dark shadow-sm lg:hidden'>
					<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
						<button
							type='button'
							className='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
							onClick={() => setSidebarOpen(true)}
						>
							<span className='sr-only'>Open sidebar</span>
							<Menu className='h-6 w-6' aria-hidden='true' />
						</button>
					</div>
				</header>
				<main className='flex-1 overflow-auto bg-gradient-light dark:bg-gradient-dark'>
					<div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
