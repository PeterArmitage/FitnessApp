import { Metadata } from 'next';

export const sharedMetadata: Metadata = {
	title: {
		default: 'Fit Forge',
		template: '%s | Fit Forge',
	},
	description:
		'Track your workouts, nutrition, and sleep with our comprehensive fitness dashboard.',
	keywords: 'fitness, workout, nutrition, sleep tracking, health',
};
