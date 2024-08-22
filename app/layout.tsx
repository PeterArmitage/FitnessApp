// app/layout.tsx
import { Metadata } from 'next';
import { sharedMetadata } from './sharedMetaData';
import RootLayoutClient from './RootLayoutClient';
import './globals.css';

export const metadata: Metadata = {
	...sharedMetadata,
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head></head>
			<body className='bg-gradient-light from-blue-500 to-purple-600 dark:bg-gradient-dark dark:from-gray-900 dark:to-purple-900 text-app-text-light dark:text-app-text-dark'>
				<RootLayoutClient>{children}</RootLayoutClient>
			</body>
		</html>
	);
}
