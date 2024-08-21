const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	try {
		const entries = await prisma.sleepEntry.findMany({
			select: {
				id: true,
				userId: true,
				date: true,
				sleepDuration: true,
				mood: true,
				comment: true,
				// Exclude createdAt and updatedAt
			},
		});
		console.log(JSON.stringify(entries, null, 2));
	} catch (error) {
		console.error('Error fetching sleep entries:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
