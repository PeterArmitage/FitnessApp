// utils/exerciseApi.ts
import axios from 'axios';

interface Exercise {
	id: string;
	name: string;
	equipment: string;
	gifUrl: string;
	instructions: string[];
}
const muscleGroupMapping: { [key: string]: string } = {
	back: 'back',
	cardio: 'cardio',
	chest: 'chest',
	lowerarms: 'lower arms',
	lowerlegs: 'lower legs',
	neck: 'neck',
	shoulders: 'shoulders',
	upperarms: 'upper arms',
	upperlegs: 'upper legs',
	waist: 'waist',
};

if (!process.env.NEXT_PUBLIC_RAPIDAPI_KEY) {
	console.error('NEXT_PUBLIC_RAPIDAPI_KEY is not set');
}

const isValidMuscleGroup = (muscle: string): boolean => {
	return muscle.toLowerCase().trim() in muscleGroupMapping;
};

export const getExercisesByMuscle = async (
	muscle: string,
	page: number = 1,
	limit: number = 10
): Promise<{ exercises: Exercise[] }> => {
	const formattedMuscle = muscle.toLowerCase().trim();
	if (!isValidMuscleGroup(formattedMuscle)) {
		console.error(`Invalid muscle group: ${muscle}`);
		return { exercises: [] };
	}

	const apiMuscle = muscleGroupMapping[formattedMuscle];
	const options = {
		method: 'GET',
		url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${apiMuscle}`,
		headers: {
			'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
			'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
		},
		params: {
			limit: limit.toString(),
			offset: ((page - 1) * limit).toString(),
		},
	};

	try {
		const response = await axios.request(options);
		return {
			exercises: response.data,
		};
	} catch (error) {
		console.error('Error fetching exercises:', error);
		throw error;
	}
};
