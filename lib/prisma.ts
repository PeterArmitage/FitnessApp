import { PrismaClient } from '@prisma/client';

// Declare a global type for prisma, but use a different name
declare global {
	var prismaSingleton: PrismaClient | undefined;
}

// Use a different name for the local variable
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!global.prismaSingleton) {
		global.prismaSingleton = new PrismaClient();
	}
	prisma = global.prismaSingleton;
}

export default prisma;
