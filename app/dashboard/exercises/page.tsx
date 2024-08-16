'use client';

import { useState, useEffect } from 'react';
import { getExercisesByMuscle } from '../../utils/exerciseApi';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Exercise {
	id: string;
	name: string;
	equipment: string;
	gifUrl: string;
	instructions: string[];
}

const muscleGroups = [
	'back',
	'cardio',
	'chest',
	'lowerarms',
	'lowerlegs',
	'neck',
	'shoulders',
	'upperarms',
	'upperlegs',
	'waist',
];

export default function ExerciseLibrary() {
	const [selectedMuscle, setSelectedMuscle] = useState<string>('');
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const exercisesPerPage = 10;

	const fetchExercises = async (muscle: string, pageNum: number) => {
		if (muscle) {
			setLoading(true);
			try {
				const { exercises: newExercises } = await getExercisesByMuscle(
					muscle,
					pageNum,
					exercisesPerPage
				);
				setExercises((prev) =>
					pageNum === 1 ? newExercises : [...prev, ...newExercises]
				);
				setError(null);
			} catch (error) {
				console.error('Failed to fetch exercises:', error);
				setError('Failed to fetch exercises. Please try again.');
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		if (selectedMuscle) {
			setPage(1);
			fetchExercises(selectedMuscle, 1);
		}
	}, [selectedMuscle]);

	const handleLoadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchExercises(selectedMuscle, nextPage);
	};

	return (
		<>
			<h1 className='text-3xl font-bold mb-4'>Exercise Library</h1>
			<Select
				onValueChange={(value) => {
					setSelectedMuscle(value);
					setExercises([]);
				}}
				value={selectedMuscle}
			>
				<SelectTrigger>
					<SelectValue placeholder='Select a muscle group' />
				</SelectTrigger>
				<SelectContent>
					{muscleGroups.map((muscle) => (
						<SelectItem key={muscle} value={muscle}>
							{muscle.charAt(0).toUpperCase() + muscle.slice(1)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && <p className='text-red-500 mt-2'>{error}</p>}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
				{exercises.map((exercise) => (
					<Card key={exercise.id}>
						<CardContent className='p-4'>
							<h3 className='font-bold text-lg mb-2'>{exercise.name}</h3>
							<Image
								src={exercise.gifUrl}
								alt={exercise.name}
								width={300}
								height={200}
								unoptimized
								className='w-full h-48 object-cover mb-2'
							/>
							<p className='font-semibold mb-1'>
								Equipment: {exercise.equipment}
							</p>
							<p className='font-semibold mb-1'>Instructions:</p>
							<ul className='list-disc pl-5'>
								{exercise.instructions.slice(0, 3).map((instruction, index) => (
									<li key={index}>{instruction}</li>
								))}
							</ul>
							{exercise.instructions.length > 3 && (
								<p className='text-sm text-gray-500 mt-1'>
									...and {exercise.instructions.length - 3} more steps
								</p>
							)}
						</CardContent>
					</Card>
				))}
			</div>
			{exercises.length > 0 && exercises.length % exercisesPerPage === 0 && (
				<div className='flex justify-center mt-4'>
					<Button onClick={handleLoadMore} disabled={loading}>
						{loading ? 'Loading...' : 'Load More'}
					</Button>
				</div>
			)}
		</>
	);
}
