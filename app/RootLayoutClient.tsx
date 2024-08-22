// app/RootLayoutClient.tsx
'use client';

import { Providers } from './providers';
import { SessionProvider } from 'next-auth/react';

export default function RootLayoutClient({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<Providers>{children}</Providers>
		</SessionProvider>
	);
}
