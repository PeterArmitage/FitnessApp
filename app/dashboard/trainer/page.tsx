'use client';

import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import {
	fetchExercisesByBodyPart,
	fetchAllExercises,
} from '../../services/exerciseService';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';

const bodyParts = [
	'back',
	'cardio',
	'chest',
	'lower arms',
	'lower legs',
	'neck',
	'shoulders',
	'upper arms',
	'upper legs',
	'waist',
];

export default function Trainer() {
	const [selectedBodyPart, setSelectedBodyPart] = useState('');
	const [selectedExercise, setSelectedExercise] = useState('');
	const [exercises, setExercises] = useState<any[]>([]);
	const [allExercises, setAllExercises] = useState<any[]>([]);
	const [newCustomExercise, setNewCustomExercise] = useState({
		name: '',
		bodyPart: '',
	});
	const {
		exercises: workoutExercises,
		customExercises,
		addExercise,
		removeExercise,
		addSet,
		updateSet,
		toggleSetCompletion,
		addCustomExercise,
		finishWorkout,
	} = useWorkoutStore();

	useEffect(() => {
		fetchAllExercises(250)
			.then((data) => setAllExercises(data))
			.catch((error) => console.error('Error fetching all exercises:', error));
	}, []);

	useEffect(() => {
		if (selectedBodyPart && selectedBodyPart !== 'all') {
			fetchExercisesByBodyPart(selectedBodyPart, 250)
				.then((data) => setExercises(data))
				.catch((error) => console.error('Error fetching exercises:', error));
		} else {
			setExercises(allExercises);
		}
	}, [selectedBodyPart, allExercises]);
	const handleAddExercise = () => {
		if (selectedExercise) {
			addExercise({
				id: Date.now().toString(),
				name: selectedExercise,
				bodyPart: selectedBodyPart || 'Unknown',
				sets: [],
			});
			setSelectedExercise('');
		}
	};

	const handleAddSet = (exerciseId: string) => {
		addSet(exerciseId, {
			id: Date.now().toString(),
			number:
				workoutExercises.find((e) => e.id === exerciseId)?.sets.length! + 1,
			previousWeight: 0,
			weight: 0,
			reps: 0,
			completed: false,
		});
	};

	const handleAddCustomExercise = () => {
		if (newCustomExercise.name && newCustomExercise.bodyPart) {
			addCustomExercise({
				id: Date.now().toString(),
				name: newCustomExercise.name,
				bodyPart: newCustomExercise.bodyPart,
			});
			setNewCustomExercise({ name: '', bodyPart: '' });
		}
	};
	const handleFinishWorkout = () => {
		finishWorkout();
	};
	return (
		<div className='p-4'>
			<h1 className='text-3xl font-bold mb-4'>Workout Log</h1>

			<div className='mb-4'>
				<Select onValueChange={setSelectedBodyPart}>
					<SelectTrigger>
						<SelectValue placeholder='Select body part (optional)' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All body parts</SelectItem>
						{bodyParts.map((part) => (
							<SelectItem key={part} value={part}>
								{part}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='mb-4'>
				<Select onValueChange={setSelectedExercise}>
					<SelectTrigger>
						<SelectValue placeholder='Select exercise' />
					</SelectTrigger>
					<SelectContent>
						{exercises.map((exercise) => (
							<SelectItem key={exercise.id} value={exercise.name}>
								{exercise.name}
							</SelectItem>
						))}
						{customExercises
							.filter(
								(e) =>
									selectedBodyPart === 'all' || e.bodyPart === selectedBodyPart
							)
							.map((exercise) => (
								<SelectItem key={exercise.id} value={exercise.name}>
									{exercise.name} (Custom)
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			<Button onClick={handleAddExercise} disabled={!selectedExercise}>
				Add Exercise
			</Button>

			<Dialog>
				<DialogTrigger asChild>
					<Button className='ml-2'>Add Custom Exercise</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Custom Exercise</DialogTitle>
						<DialogDescription>
							Create a new custom exercise to add to your workout.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<Input
							placeholder='Exercise name'
							value={newCustomExercise.name}
							onChange={(e) =>
								setNewCustomExercise({
									...newCustomExercise,
									name: e.target.value,
								})
							}
						/>
						<Select
							onValueChange={(value) =>
								setNewCustomExercise({ ...newCustomExercise, bodyPart: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select body part' />
							</SelectTrigger>
							<SelectContent>
								{bodyParts.map((part) => (
									<SelectItem key={part} value={part}>
										{part}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button onClick={handleAddCustomExercise}>
							Add Custom Exercise
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className='mt-8'>
				{workoutExercises.map((exercise) => (
					<div key={exercise.id} className='mb-6 p-4 border rounded'>
						<h2 className='text-xl font-semibold mb-2'>{exercise.name}</h2>
						<p className='text-sm text-gray-600 mb-4'>
							Body Part: {exercise.bodyPart}
						</p>
						<Button
							onClick={() => removeExercise(exercise.id)}
							variant='destructive'
							size='sm'
							className='mb-4'
						>
							Remove Exercise
						</Button>
						<table className='w-full'>
							<thead>
								<tr>
									<th className='text-left'>Set</th>
									<th className='text-left'>Previous Weight</th>
									<th className='text-left'>Weight</th>
									<th className='text-left'>Reps</th>
									<th className='text-left'>Completed</th>
								</tr>
							</thead>
							<tbody>
								{exercise.sets.map((set) => (
									<tr key={set.id}>
										<td>{set.number}</td>
										<td>{set.previousWeight} kg</td>
										<td>
											<Input
												type='number'
												value={set.weight}
												onChange={(e) =>
													updateSet(exercise.id, set.id, {
														weight: Number(e.target.value),
													})
												}
												className='w-20'
											/>
										</td>
										<td>
											<Input
												type='number'
												value={set.reps}
												onChange={(e) =>
													updateSet(exercise.id, set.id, {
														reps: Number(e.target.value),
													})
												}
												className='w-20'
											/>
										</td>
										<td>
											<Checkbox
												checked={set.completed}
												onCheckedChange={() =>
													toggleSetCompletion(exercise.id, set.id)
												}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<Button onClick={() => handleAddSet(exercise.id)} className='mt-4'>
							Add Set
						</Button>
					</div>
				))}
			</div>
			{workoutExercises.length > 0 && (
				<Button onClick={handleFinishWorkout} className='mt-8'>
					Finish Workout
				</Button>
			)}
		</div>
	);
}
