// components/Sidebar/SidebarItem.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import * as FaIcons from 'react-icons/fa';

interface SidebarItemProps {
	icon: string;
	name: string;
	href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, name, href }) => {
	const pathname = usePathname();
	const isActive = pathname === href;
	const IconComponent = FaIcons[icon as keyof typeof FaIcons] as IconType;

	return (
		<li className='mb-2'>
			<Link href={href}>
				<span
					className={`flex items-center p-4 rounded-lg ${
						isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
					}`}
				>
					{IconComponent && <IconComponent className='mr-2' />}
					{name}
				</span>
			</Link>
		</li>
	);
};

export default SidebarItem;
