// pages/dashboard/logs.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';

export default function Logs() {
	const { completedWorkouts } = useWorkoutStore();

	return (
		<div className='p-4'>
			<h1 className='text-3xl font-bold mb-4'>Workout Logs</h1>
			{completedWorkouts.length === 0 ? (
				<p>No completed workouts yet.</p>
			) : (
				<ul>
					{completedWorkouts.map((workout, index) => (
						<li key={index} className='mb-4 p-4 border rounded'>
							<h2 className='text-xl font-semibold'>
								Workout on {new Date(workout.date).toLocaleDateString()}
							</h2>
							<ul>
								{workout.exercises.map((exercise, exIndex) => (
									<li key={exIndex} className='ml-4'>
										<h3 className='font-medium'>{exercise.name}</h3>
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
		</div>
	);
}
