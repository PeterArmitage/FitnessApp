import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface FoodEntry {
	id: string;
	name: string;
	calories: number;
	meal: string;
	date: string;
}

interface FoodEntryFormProps {
	onAddEntry: (entry: FoodEntry) => void;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onAddEntry }) => {
	const { data: session } = useSession();
	const [name, setName] = useState('');
	const [calories, setCalories] = useState('');
	const [meal, setMeal] = useState('breakfast');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!session) return;

		try {
			const response = await fetch('/api/food-entries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					calories: parseInt(calories),
					meal,
					date: new Date().toISOString(),
				}),
			});

			if (response.ok) {
				const newEntry = await response.json();
				onAddEntry(newEntry);
				setName('');
				setCalories('');
				setMeal('breakfast');
			} else {
				console.error('Failed to add food entry');
			}
		} catch (error) {
			console.error('Error adding food entry:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<label htmlFor='name' className='block text-sm font-medium'>
					Food Name
				</label>
				<input
					type='text'
					id='name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
				/>
			</div>
			<div>
				<label htmlFor='calories' className='block text-sm font-medium'>
					Calories
				</label>
				<input
					type='number'
					id='calories'
					value={calories}
					onChange={(e) => setCalories(e.target.value)}
					required
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
				/>
			</div>
			<div>
				<label htmlFor='meal' className='block text-sm font-medium'>
					Meal
				</label>
				<select
					id='meal'
					value={meal}
					onChange={(e) => setMeal(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
				>
					<option value='breakfast'>Breakfast</option>
					<option value='lunch'>Lunch</option>
					<option value='dinner'>Dinner</option>
					<option value='snack'>Snack</option>
				</select>
			</div>
			<Button type='submit'>Add Food Entry</Button>
		</form>
	);
};

export default FoodEntryForm;
