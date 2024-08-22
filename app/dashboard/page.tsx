'use client';

import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserSettings } from '../hooks/useUserSettings';
import { useWorkoutStore } from '../store/workoutStore';
import { CardSkeleton, ChartSkeleton } from '../components/Skeletons';
import { useQuery } from 'react-query';
import { MainLayout } from '../components/MainLayout';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip as ChartTooltip,
	Legend,
} from 'chart.js';
import { Line as ChartLine } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	ChartTooltip,
	Legend
);

const ChartComponent = ({
	data,
	dataKey,
	label,
}: {
	data: any[];
	dataKey: string;
	label: string;
}) => {
	const chartData = {
		labels: data.map((item) => item.date),
		datasets: [
			{
				label: label,
				data: data.map((item) => item[dataKey]),
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return <ChartLine data={chartData} options={options} />;
};

// Interfaces
interface FoodEntry {
	id: string;
	date: string;
	calories: number;
}

interface SleepEntry {
	id: string;
	date: string;
	sleepDuration: number;
}

interface Exercise {
	id: string;
	name: string;
	// Add other exercise properties as needed
}

interface Workout {
	date: string;
	exercises: Exercise[];
}

interface CompletedWorkout {
	date: number;
	exercises: Exercise[];
}

interface UserSettings {
	units: 'metric' | 'imperial';
	// Add other settings properties as needed
}

// API fetch functions
const fetchFoodEntries = async (): Promise<FoodEntry[]> => {
	const response = await fetch('/api/food-entries');
	if (!response.ok) throw new Error('Failed to fetch food entries');
	return response.json();
};

const fetchSleepEntries = async (): Promise<SleepEntry[]> => {
	const response = await fetch('/api/sleep-entries');
	if (!response.ok) throw new Error('Failed to fetch sleep entries');
	return response.json();
};

// Main component
export default function Overview() {
	const { data: session } = useSession();
	const { settings } = useUserSettings();
	const { completedWorkouts } = useWorkoutStore();

	const { data: foodEntries = [], isLoading: isFoodLoading } = useQuery<
		FoodEntry[]
	>('foodEntries', fetchFoodEntries);
	const { data: sleepEntries = [], isLoading: isSleepLoading } = useQuery<
		SleepEntry[]
	>('sleepEntries', fetchSleepEntries);

	const calculateAverageCalories = () => {
		if (foodEntries.length === 0) return 0;
		const totalCalories = foodEntries.reduce(
			(sum, entry) => sum + entry.calories,
			0
		);
		return Math.round(totalCalories / foodEntries.length);
	};

	const calculateAverageSleepDuration = () => {
		if (sleepEntries.length === 0) return 0;
		const totalDuration = sleepEntries.reduce(
			(sum, entry) => sum + entry.sleepDuration,
			0
		);
		return Math.round((totalDuration / sleepEntries.length) * 10) / 10;
	};

	const getRecentWorkouts = (): Workout[] => {
		return completedWorkouts
			.slice(-5)
			.reverse()
			.map((workout: CompletedWorkout) => ({
				...workout,
				date: new Date(workout.date).toISOString(),
			}));
	};

	return (
		<MainLayout showAuthButtons={false}>
			<div className='space-y-6 p-4'>
				<h1 className='text-2xl sm:text-3xl font-bold'>Overview</h1>
				<p className='mt-2 text-sm sm:text-base'>
					Welcome to your fitness dashboard, {session?.user?.name}!
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
					<Suspense fallback={<CardSkeleton />}>
						<CalorieIntakeCard
							averageCalories={calculateAverageCalories()}
							foodEntries={foodEntries}
							units={settings.units}
							isLoading={isFoodLoading}
						/>
					</Suspense>

					<Suspense fallback={<CardSkeleton />}>
						<SleepDurationCard
							averageSleepDuration={calculateAverageSleepDuration()}
							sleepEntries={sleepEntries}
							isLoading={isSleepLoading}
						/>
					</Suspense>

					<Suspense fallback={<CardSkeleton />}>
						<RecentWorkoutsCard workouts={getRecentWorkouts()} />
					</Suspense>

					<Suspense fallback={<CardSkeleton />}>
						<QuickLinksCard />
					</Suspense>
				</div>
			</div>
		</MainLayout>
	);
}

// Sub-components
interface CalorieIntakeCardProps {
	averageCalories: number;
	foodEntries: FoodEntry[];
	units: UserSettings['units'];
	isLoading: boolean;
}

function CalorieIntakeCard({
	averageCalories,
	foodEntries,
	units,
	isLoading,
}: CalorieIntakeCardProps) {
	if (isLoading) return <CardSkeleton />;

	return (
		<Card className='col-span-1 sm:col-span-2 lg:col-span-1'>
			<CardHeader>
				<CardTitle className='text-lg sm:text-xl'>Calorie Intake</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='text-xl sm:text-2xl font-bold'>
					{averageCalories} {units === 'metric' ? 'kcal' : 'Cal'}
				</p>
				<p className='text-xs sm:text-sm text-gray-500'>Average daily intake</p>
				<div className='h-48 sm:h-64 mt-4'>
					<Suspense fallback={<ChartSkeleton />}>
						<ChartComponent
							data={foodEntries.slice(-7)}
							dataKey='calories'
							label='Calories'
						/>
					</Suspense>
				</div>
			</CardContent>
		</Card>
	);
}

interface SleepDurationCardProps {
	averageSleepDuration: number;
	sleepEntries: SleepEntry[];
	isLoading: boolean;
}

function SleepDurationCard({
	averageSleepDuration,
	sleepEntries,
	isLoading,
}: SleepDurationCardProps) {
	if (isLoading) return <CardSkeleton />;

	return (
		<Card className='col-span-1 sm:col-span-2 lg:col-span-1'>
			<CardHeader>
				<CardTitle className='text-lg sm:text-xl'>Sleep Duration</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='text-xl sm:text-2xl font-bold'>
					{averageSleepDuration} hours
				</p>
				<p className='text-xs sm:text-sm text-gray-500'>
					Average sleep duration
				</p>
				<div className='h-48 sm:h-64 mt-4'>
					<Suspense fallback={<ChartSkeleton />}>
						<ChartComponent
							data={sleepEntries.slice(-7)}
							dataKey='sleepDuration'
							label='Sleep Duration'
						/>
					</Suspense>
				</div>
			</CardContent>
		</Card>
	);
}

interface RecentWorkoutsCardProps {
	workouts: Workout[];
}

function RecentWorkoutsCard({ workouts }: RecentWorkoutsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg sm:text-xl'>Recent Workouts</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className='space-y-2 text-xs sm:text-sm'>
					{workouts.map((workout, index) => (
						<li key={index}>
							{new Date(workout.date).toLocaleDateString()}:{' '}
							{workout.exercises.length} exercises
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
function QuickLinksCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg sm:text-xl'>Quick Links</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className='space-y-2 text-xs sm:text-sm'>
					<li>
						<a href='/dashboard/food' className='text-blue-500 hover:underline'>
							Food Diary
						</a>
					</li>
					<li>
						<a
							href='/dashboard/sleep'
							className='text-blue-500 hover:underline'
						>
							Sleep Log
						</a>
					</li>
					<li>
						<a
							href='/dashboard/trainer'
							className='text-blue-500 hover:underline'
						>
							Workout Trainer
						</a>
					</li>
					<li>
						<a
							href='/dashboard/exercise'
							className='text-blue-500 hover:underline'
						>
							Exercise Library
						</a>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}
