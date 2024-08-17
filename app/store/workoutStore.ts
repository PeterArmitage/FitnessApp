// store/workoutStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Exercise {
	id: string;
	name: string;
	bodyPart: string;
	sets: Set[];
}

interface Set {
	id: string;
	number: number;
	previousWeight: number;
	weight: number;
	reps: number;
	completed: boolean;
}

interface CustomExercise {
	id: string;
	name: string;
	bodyPart: string;
}
interface CompletedWorkout {
	date: number;
	exercises: Exercise[];
}

interface WorkoutStore {
	exercises: Exercise[];
	customExercises: CustomExercise[];
	addExercise: (exercise: Exercise) => void;
	removeExercise: (id: string) => void;
	addSet: (exerciseId: string, set: Set) => void;
	updateSet: (
		exerciseId: string,
		setId: string,
		updatedSet: Partial<Set>
	) => void;
	toggleSetCompletion: (exerciseId: string, setId: string) => void;
	addCustomExercise: (exercise: CustomExercise) => void;
	removeCustomExercise: (id: string) => void;
	completedWorkouts: CompletedWorkout[];
	finishWorkout: () => void;
}
export const useWorkoutStore = create<WorkoutStore>()(
	persist(
		(set) => ({
			exercises: [],
			customExercises: [],
			completedWorkouts: [],
			addExercise: (exercise) =>
				set((state) => ({ exercises: [...state.exercises, exercise] })),
			removeExercise: (id) =>
				set((state) => ({
					exercises: state.exercises.filter((e) => e.id !== id),
				})),
			addSet: (exerciseId, newSet) =>
				set((state) => ({
					exercises: state.exercises.map((e) =>
						e.id === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e
					),
				})),
			updateSet: (exerciseId, setId, updatedSet) =>
				set((state) => ({
					exercises: state.exercises.map((e) =>
						e.id === exerciseId
							? {
									...e,
									sets: e.sets.map((s) =>
										s.id === setId ? { ...s, ...updatedSet } : s
									),
							  }
							: e
					),
				})),
			toggleSetCompletion: (exerciseId, setId) =>
				set((state) => ({
					exercises: state.exercises.map((e) =>
						e.id === exerciseId
							? {
									...e,
									sets: e.sets.map((s) =>
										s.id === setId ? { ...s, completed: !s.completed } : s
									),
							  }
							: e
					),
				})),
			addCustomExercise: (exercise) =>
				set((state) => ({
					customExercises: [...state.customExercises, exercise],
				})),
			removeCustomExercise: (id) =>
				set((state) => ({
					customExercises: state.customExercises.filter((e) => e.id !== id),
				})),
			finishWorkout: () =>
				set((state) => {
					const newCompletedWorkout: CompletedWorkout = {
						date: Date.now(),
						exercises: state.exercises,
					};
					return {
						completedWorkouts: [
							...state.completedWorkouts,
							newCompletedWorkout,
						],
						exercises: [], // Reset current workout
					};
				}),
		}),
		{
			name: 'workout-store',
		}
	)
);
