// app/page.tsx
import { Metadata } from 'next';
import { MainLayout } from './components/MainLayout';

export const metadata: Metadata = {
	title: 'Fit Forge',
	description:
		'Track your workouts, nutrition, and sleep with our comprehensive fitness dashboard.',
	keywords: 'fitness, workout, nutrition, sleep tracking, health',
};

export default function Home() {
	return (
		<MainLayout>
			<h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center'>
				Welcome to Fit Forge
			</h1>
			<p className='text-lg sm:text-xl mb-8 text-center max-w-2xl'>
				Track your workouts, monitor your diet, and achieve your fitness goals
				with our comprehensive fitness platform.
			</p>
		</MainLayout>
	);
}
