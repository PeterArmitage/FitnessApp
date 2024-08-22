'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { useUserSettings } from '../hooks/useUserSettings';
import { useWorkoutStore } from '../store/workoutStore';

interface FoodEntry {
	id: string;
	date: string;
	calories: number;
	// Add other properties as needed
}

interface SleepEntry {
	id: string;
	date: string;
	sleepDuration: number;
	// Add other properties as needed
}

export default function Overview() {
	const { data: session } = useSession();
	const { settings } = useUserSettings();
	const { completedWorkouts } = useWorkoutStore();
	const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
	const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);

	useEffect(() => {
		if (session) {
			fetchFoodEntries();
			fetchSleepEntries();
		}
	}, [session]);

	const fetchFoodEntries = async () => {
		const response = await fetch('/api/food-entries');
		if (response.ok) {
			const data = await response.json();
			setFoodEntries(data);
		}
	};

	const fetchSleepEntries = async () => {
		const response = await fetch('/api/sleep-entries');
		if (response.ok) {
			const data = await response.json();
			setSleepEntries(data);
		}
	};

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

	const getRecentWorkouts = () => {
		return completedWorkouts.slice(-5).reverse();
	};

	return (
		<div className='space-y-6 p-4'>
			<h1 className='text-2xl sm:text-3xl font-bold'>Overview</h1>
			<p className='mt-2 text-sm sm:text-base'>
				Welcome to your fitness dashboard, {session?.user?.name}!
			</p>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
				<Card className='col-span-1 sm:col-span-2 lg:col-span-1'>
					<CardHeader>
						<CardTitle className='text-lg sm:text-xl'>Calorie Intake</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-xl sm:text-2xl font-bold'>
							{calculateAverageCalories()}{' '}
							{settings.units === 'metric' ? 'kcal' : 'Cal'}
						</p>
						<p className='text-xs sm:text-sm text-gray-500'>
							Average daily intake
						</p>
						<div className='h-48 sm:h-64 mt-4'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={foodEntries.slice(-7)}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='date' tick={{ fontSize: 12 }} />
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Line type='monotone' dataKey='calories' stroke='#8884d8' />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card className='col-span-1 sm:col-span-2 lg:col-span-1'>
					<CardHeader>
						<CardTitle className='text-lg sm:text-xl'>Sleep Duration</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-xl sm:text-2xl font-bold'>
							{calculateAverageSleepDuration()} hours
						</p>
						<p className='text-xs sm:text-sm text-gray-500'>
							Average sleep duration
						</p>
						<div className='h-48 sm:h-64 mt-4'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={sleepEntries.slice(-7)}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='date' tick={{ fontSize: 12 }} />
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Line
										type='monotone'
										dataKey='sleepDuration'
										stroke='#82ca9d'
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='text-lg sm:text-xl'>
							Recent Workouts
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='space-y-2 text-xs sm:text-sm'>
							{getRecentWorkouts().map((workout, index) => (
								<li key={index}>
									{new Date(workout.date).toLocaleDateString()}:{' '}
									{workout.exercises.length} exercises
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='text-lg sm:text-xl'>Quick Links</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='space-y-2 text-xs sm:text-sm'>
							<li>
								<a
									href='/dashboard/food'
									className='text-blue-500 hover:underline'
								>
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
			</div>
		</div>
	);
}
