import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/auth-options';

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await req.json();
		const { name, calories, weight, weightUnit } = body;

		console.log('Received data:', body);

		// Validate the required fields
		if (!name || typeof calories !== 'number' || isNaN(calories)) {
			return NextResponse.json(
				{ error: 'Invalid input data: name and calories are required' },
				{ status: 400 }
			);
		}

		// Ensure the user's ID is a valid UUID
		const userId = session.user.id;
		if (typeof userId !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(userId)) {
			return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
		}

		const userFood = await prisma.userFood.upsert({
			where: {
				userId_name: {
					userId: userId,
					name: name,
				},
			},
			update: {
				calories: calories,
				...(weight !== undefined &&
					!isNaN(weight) && { weight: Number(weight) }),
				...(weightUnit && { weightUnit }),
			},
			create: {
				userId: userId,
				name: name,
				calories: calories,
				...(weight !== undefined &&
					!isNaN(weight) && { weight: Number(weight) }),
				...(weightUnit && { weightUnit }),
			},
		});

		return NextResponse.json(userFood);
	} catch (error) {
		console.error('Error creating/updating user food:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error', details: (error as Error).message },
			{ status: 500 }
		);
	}
}
