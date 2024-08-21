// app/api/sleep-entries/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const id = params.id;

	try {
		await prisma.sleepEntry.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Sleep entry deleted successfully' });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to delete sleep entry' },
			{ status: 500 }
		);
	}
}
