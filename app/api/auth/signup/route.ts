import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
	try {
		console.log('Received signup request');
		const { name, email, password } = await request.json();
		console.log('Parsed request body:', { name, email, password: '***' });

		// Verificar se o usuário já existe
		console.log('Checking if user exists');
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			console.log('User already exists');
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 }
			);
		}

		// Hash da senha
		console.log('Hashing password');
		const hashedPassword = await bcrypt.hash(password, 10);

		// Criar novo usuário
		console.log('Creating new user');
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		console.log('User created successfully', user.id);
		return NextResponse.json(
			{ message: 'User created successfully', userId: user.id },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Signup error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
