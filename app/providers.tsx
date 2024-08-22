'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
