import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string;
const BASE_URL = 'https://exercisedb.p.rapidapi.com';

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
	},
});

export const fetchAllExercises = async (limit = 250) => {
	try {
		const response = await axiosInstance.get('/exercises', {
			params: { limit: limit.toString() },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching all exercises:', error);
		throw error;
	}
};

export const fetchExercisesByBodyPart = async (
	bodyPart: string,
	limit = 50
) => {
	try {
		const response = await axiosInstance.get(
			`/exercises/bodyPart/${bodyPart}`,
			{
				params: { limit: limit.toString() },
			}
		);
		return response.data;
	} catch (error) {
		console.error(`Error fetching exercises for ${bodyPart}:`, error);
		throw error;
	}
};
