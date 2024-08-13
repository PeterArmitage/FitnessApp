// app/layout.tsx
'use client';
import { Providers } from './providers';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className='bg-gradient-light from-blue-500 to-purple-600 dark:bg-gradient-dark dark:from-gray-900 dark:to-purple-900 text-app-text-light dark:text-app-text-dark'>
				<SessionProvider>
					<Providers>{children}</Providers>
				</SessionProvider>
			</body>
		</html>
	);
}
