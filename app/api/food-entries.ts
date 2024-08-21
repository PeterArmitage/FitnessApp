import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { method } = req;

	switch (method) {
		case 'GET':
			try {
				const foodEntries = await prisma.foodEntry.findMany({
					where: { userId: session.user.id },
					orderBy: { date: 'desc' },
				});
				res.status(200).json(foodEntries);
			} catch (error) {
				res.status(500).json({ error: 'Error fetching food entries' });
			}
			break;

		case 'POST':
			try {
				const { name, calories, meal, date } = req.body;
				const newFoodEntry = await prisma.foodEntry.create({
					data: {
						userId: session.user.id,
						name,
						calories: parseInt(calories),
						meal,
						date: new Date(date),
					},
				});
				res.status(201).json(newFoodEntry);
			} catch (error) {
				res.status(500).json({ error: 'Error creating food entry' });
			}
			break;

		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
