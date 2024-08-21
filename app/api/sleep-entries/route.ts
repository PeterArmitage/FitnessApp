import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const entries = await prisma.sleepEntry.findMany({
			where: { userId: session.user.id },
			orderBy: { date: 'desc' },
			select: {
				id: true,
				date: true,
				sleepDuration: true,
				mood: true,
				comment: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return NextResponse.json(entries);
	} catch (error) {
		console.error('Error fetching sleep entries:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
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
		const { date, sleepDuration, mood, comment } = await request.json();

		const entry = await prisma.sleepEntry.create({
			data: {
				userId: session.user.id,
				date: new Date(date),
				sleepDuration,
				mood,
				comment,
			},
		});

		return NextResponse.json(entry);
	} catch (error) {
		console.error('Error creating sleep entry:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
