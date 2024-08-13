// app/dashboard/layout.tsx
import Sidebar from '../components/Sidebar/Sidebar';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex h-screen'>
			<Sidebar />
			<main className='flex-1 p-8 overflow-auto'>{children}</main>
		</div>
	);
}
