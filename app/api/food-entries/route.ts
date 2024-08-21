import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		console.log('No session found or user not in session');
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		console.log('Session user ID:', session.user.id);
		const foodEntries = await prisma.foodEntry.findMany({
			where: { userId: session.user.id },
			orderBy: { date: 'desc' },
		});
		console.log('Food entries fetched:', foodEntries.length);
		return NextResponse.json(foodEntries);
	} catch (error) {
		console.error('Error fetching food entries:', error);
		return NextResponse.json(
			{ error: 'Error fetching food entries', details: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { name, calories, meal, date } = await request.json();

		const parsedCalories = parseInt(calories, 10);
		if (isNaN(parsedCalories)) {
			return NextResponse.json(
				{ error: 'Invalid calories value' },
				{ status: 400 }
			);
		}

		const newFoodEntry = await prisma.foodEntry.create({
			data: {
				name,
				calories: parsedCalories,
				meal,
				date: new Date(date),
				user: {
					connect: { id: session.user.id },
				},
			},
		});

		return NextResponse.json(newFoodEntry, { status: 201 });
	} catch (error) {
		console.error('Error creating food entry:', error);
		return NextResponse.json(
			{ error: 'Error creating food entry', details: error.message },
			{ status: 500 }
		);
	}
}
