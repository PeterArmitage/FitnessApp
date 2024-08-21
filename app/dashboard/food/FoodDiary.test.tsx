import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import FoodDiary from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
	})),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
	useSession: jest.fn(() => ({
		data: { user: { name: 'Test User' } },
		status: 'authenticated',
	})),
	SessionProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

// Mock fetch
global.fetch = jest.fn((url) => {
	if (url === '/api/food-entries') {
		return Promise.resolve({
			ok: true,
			json: () => Promise.resolve([]),
		});
	}
	if (url === '/api/user-foods') {
		return Promise.resolve({
			ok: true,
			json: () => Promise.resolve({}),
		});
	}
	return Promise.resolve({
		ok: true,
		json: () => Promise.resolve({}),
	});
}) as jest.Mock;

// Mock date
const mockDate = new Date('2024-08-20T12:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

// Mock useUserSettings hook
jest.mock('../../hooks/useUserSettings', () => ({
	useUserSettings: () => ({
		settings: { units: 'metric' },
		updateUserSettings: jest.fn(),
	}),
}));

// Custom render function

// ... previous mocks ...

jest.setTimeout(60000); // Set a global timeout of 60 seconds

const customRender = (ui: React.ReactElement, options = {}) =>
	render(
		<SessionProvider session={{ user: { name: 'Test User' }, expires: '1' }}>
			{ui}
		</SessionProvider>,
		options
	);

describe('FoodDiary', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		console.log('Test started');
	});

	afterEach(() => {
		console.log('Test ended');
	});

	test('renders food diary title', async () => {
		console.log('Rendering FoodDiary component');
		await act(async () => {
			customRender(<FoodDiary />);
		});

		console.log('Waiting for Food Diary title');
		await waitFor(
			() => {
				const titleElement = screen.getByText(/Food Diary/i);
				console.log('Food Diary title found:', titleElement.textContent);
				expect(titleElement).toBeInTheDocument();
			},
			{ timeout: 30000 }
		);
	}, 35000);

	test('adds a new food entry when form is submitted', async () => {
		console.log('Rendering FoodDiary component');
		await act(async () => {
			customRender(<FoodDiary />);
		});

		console.log('Waiting for initial fetch to complete');
		await waitFor(
			() =>
				expect(fetch).toHaveBeenCalledWith(
					'/api/food-entries',
					expect.anything()
				),
			{ timeout: 30000 }
		);

		console.log('Filling out the form');
		await act(async () => {
			await userEvent.type(screen.getByLabelText(/Food name/i), 'Apple');
			await userEvent.type(screen.getByLabelText(/Calories/i), '95');
		});

		console.log('Submitting the form');
		await act(async () => {
			await userEvent.click(screen.getByText(/Add Food/i));
		});

		console.log('Waiting for form submission to complete');
		await waitFor(
			() =>
				expect(fetch).toHaveBeenCalledWith(
					'/api/food-entries',
					expect.objectContaining({
						method: 'POST',
						body: expect.stringContaining('"name":"Apple","calories":"95"'),
					})
				),
			{ timeout: 30000 }
		);

		console.log('Checking if new entry appears in the list');
		await waitFor(
			() => {
				expect(screen.getByText('Apple')).toBeInTheDocument();
				expect(screen.getByText('95')).toBeInTheDocument();
			},
			{ timeout: 30000 }
		);
	}, 40000);
});
