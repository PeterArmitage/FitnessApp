'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FoodEntryForm from '../food/FoodEntryForm';
import FoodEntryList from '../food/FoodEntryList';

interface FoodEntry {
	id: string;
	name: string;
	calories: number;
	meal: string;
	date: string;
}

export default function FoodTracking() {
	const { data: session, status } = useSession();
	const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

	useEffect(() => {
		if (status === 'authenticated') {
			fetchFoodEntries();
		}
	}, [status]);

	const fetchFoodEntries = async () => {
		try {
			const response = await fetch('/api/food-entries');
			if (response.ok) {
				const data = await response.json();
				setFoodEntries(data);
			} else {
				console.error('Failed to fetch food entries');
			}
		} catch (error) {
			console.error('Error fetching food entries:', error);
		}
	};

	const handleAddEntry = (newEntry: FoodEntry) => {
		setFoodEntries([newEntry, ...foodEntries]);
	};

	const handleDeleteEntry = async (id: string) => {
		try {
			const response = await fetch(`/api/food-entries/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				setFoodEntries(foodEntries.filter((entry) => entry.id !== id));
			} else {
				console.error('Failed to delete food entry');
			}
		} catch (error) {
			console.error('Error deleting food entry:', error);
		}
	};

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	if (status === 'unauthenticated') {
		return <div>Please sign in to access food tracking.</div>;
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>Food Tracking</h1>
			<FoodEntryForm onAddEntry={handleAddEntry} />
			<FoodEntryList entries={foodEntries} onDelete={handleDeleteEntry} />
		</div>
	);
}
