'use client';

import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import SleepLog from '../../components/SleepLog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SleepEntry {
	id: string;
	date: Date;
	sleepDuration: number;
	mood: string;
	comment: string;
}

interface FoodEntry {
	id: string;
	date: Date;
	name: string;
	calories: number;
	weight?: number;
	weightUnit?: string;
}
export default function Logs() {
	const { completedWorkouts } = useWorkoutStore();
	const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
	const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
	const router = useRouter();

	useEffect(() => {
		fetchSleepEntries();
		fetchFoodEntries();
	}, []);

	async function fetchSleepEntries() {
		const response = await fetch('/api/sleep-entries');
		if (response.ok) {
			const data = await response.json();
			setSleepEntries(
				data.map((entry: SleepEntry) => ({
					...entry,
					date: new Date(entry.date),
				}))
			);
		}
	}

	async function fetchFoodEntries() {
		const response = await fetch('/api/food-entries');
		if (response.ok) {
			const data = await response.json();
			setFoodEntries(
				data.map((entry: FoodEntry) => ({
					...entry,
					date: new Date(entry.date),
				}))
			);
		}
	}

	const handleEdit = (id: string) => {
		// TODO: Implement edit functionality
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/sleep-entries/${id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			fetchSleepEntries();
		}
	};

	const handleBackToSleep = () => {
		router.push('/dashboard/sleep');
	};

	const handleBackToTrainer = () => {
		router.push('/dashboard/trainer');
	};

	const handleBackToFoodDiary = () => {
		router.push('/dashboard/food');
	};

	const handleBackToOverview = () => {
		router.push('/dashboard');
	};

	return (
		<div className='p-4'>
			<h1 className='text-3xl font-bold mb-4'>All Logs</h1>

			<h2 className='text-2xl font-semibold mb-4'>Sleep Logs</h2>
			{sleepEntries.length === 0 ? (
				<p>No sleep logs yet.</p>
			) : (
				<SleepLog
					entries={sleepEntries}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			)}
			<Button onClick={handleBackToSleep} className='mt-4'>
				Back to Sleep Dashboard
			</Button>

			<h2 className='text-2xl font-semibold mb-4 mt-8'>Food Logs</h2>
			{foodEntries.length === 0 ? (
				<p>No food entries yet.</p>
			) : (
				<ul>
					{foodEntries.map((entry) => (
						<li key={entry.id} className='mb-4 p-4 border rounded'>
							<h3 className='text-xl font-semibold'>
								{entry.name} - {entry.date.toLocaleDateString()}
							</h3>
							<p>Calories: {entry.calories}</p>
							{entry.weight && entry.weightUnit && (
								<p>
									Weight: {entry.weight} {entry.weightUnit}
								</p>
							)}
						</li>
					))}
				</ul>
			)}
			<Button onClick={handleBackToFoodDiary} className='mt-4'>
				Back to Food Diary
			</Button>

			<h2 className='text-2xl font-semibold mb-4 mt-8'>Workout Logs</h2>
			{completedWorkouts.length === 0 ? (
				<p>No completed workouts yet.</p>
			) : (
				<ul>
					{completedWorkouts.map((workout, index) => (
						<li key={index} className='mb-4 p-4 border rounded'>
							<h3 className='text-xl font-semibold'>
								Workout on {new Date(workout.date).toLocaleDateString()}
							</h3>
							<ul>
								{workout.exercises.map((exercise, exIndex) => (
									<li key={exIndex} className='ml-4'>
										<h4 className='font-medium'>{exercise.name}</h4>
										<ul>
											{exercise.sets.map((set, setIndex) => (
												<li key={setIndex}>
													Set {set.number}: {set.weight}kg x {set.reps} reps
												</li>
											))}
										</ul>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			)}
			<Button onClick={handleBackToTrainer} className='mt-4 mr-4'>
				Back to Trainer Dashboard
			</Button>
			<Button onClick={handleBackToOverview} className='mt-4'>
				Back to Overview
			</Button>
		</div>
	);
}
