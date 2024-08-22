// app/api/sleep-entries/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const id = params.id;

	try {
		// First, check if the sleep entry belongs to the authenticated user
		const sleepEntry = await prisma.sleepEntry.findUnique({
			where: { id },
		});

		if (!sleepEntry || sleepEntry.userId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Not found or unauthorized' },
				{ status: 404 }
			);
		}

		// If the entry belongs to the user, proceed with deletion
		await prisma.sleepEntry.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Sleep entry deleted successfully' });
	} catch (error) {
		console.error('Error deleting sleep entry:', error);
		return NextResponse.json(
			{ error: 'Failed to delete sleep entry' },
			{ status: 500 }
		);
	}
}
