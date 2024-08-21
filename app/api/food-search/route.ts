import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('query');

	if (!query) {
		return NextResponse.json(
			{ error: 'Query parameter is required' },
			{ status: 400 }
		);
	}

	const options = {
		method: 'GET',
		url: 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition',
		params: { query },
		headers: {
			'X-RapidAPI-Key': process.env.FOOD_API_KEY,
			'X-RapidAPI-Host': 'nutrition-by-api-ninjas.p.rapidapi.com',
		},
	};

	try {
		const response = await axios.request(options);
		console.log('Food search successful for query:', query);
		return NextResponse.json(response.data);
	} catch (error) {
		console.error('Error fetching food data:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(
				{ error: 'Error fetching food data', details: error.response.data },
				{ status: error.response.status }
			);
		}
		return NextResponse.json(
			{ error: 'Error fetching food data' },
			{ status: 500 }
		);
	}
}
