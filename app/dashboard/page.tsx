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
			<h1 className='text-3xl font-bold'>Overview</h1>
			<p className='mt-2'>
				Welcome to your fitness dashboard, {session?.user?.name}!
			</p>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Calorie Intake</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>
							{calculateAverageCalories()}{' '}
							{settings.units === 'metric' ? 'kcal' : 'Cal'}
						</p>
						<p className='text-sm text-gray-500'>Average daily intake</p>
						<ResponsiveContainer width='100%' height={200}>
							<LineChart data={foodEntries.slice(-7)}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='date' />
								<YAxis />
								<Tooltip />
								<Line type='monotone' dataKey='calories' stroke='#8884d8' />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Sleep Duration</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold'>
							{calculateAverageSleepDuration()} hours
						</p>
						<p className='text-sm text-gray-500'>Average sleep duration</p>
						<ResponsiveContainer width='100%' height={200}>
							<LineChart data={sleepEntries.slice(-7)}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='date' />
								<YAxis />
								<Tooltip />
								<Line
									type='monotone'
									dataKey='sleepDuration'
									stroke='#82ca9d'
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Workouts</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='space-y-2'>
							{getRecentWorkouts().map((workout, index) => (
								<li key={index} className='text-sm'>
									{new Date(workout.date).toLocaleDateString()}:{' '}
									{workout.exercises.length} exercises
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Links</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='space-y-2'>
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
