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

	try {
		const deletedEntry = await prisma.foodEntry.deleteMany({
			where: {
				id: params.id,
				userId: session.user.id, // Make sure this matches the actual user ID field in your session
			},
		});

		if (deletedEntry.count === 0) {
			return NextResponse.json(
				{ error: 'Food entry not found or not authorized to delete' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ message: 'Food entry deleted successfully' });
	} catch (error) {
		console.error('Error deleting food entry:', error);
		return NextResponse.json(
			{ error: 'Error deleting food entry' },
			{ status: 500 }
		);
	}
}
