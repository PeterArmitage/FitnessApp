'use client';

import React, {
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import FoodEntryList from './FoodEntryList';
import NutritionSummary from './NutritionSummary';
import { useUserSettings } from '../../hooks/useUserSettings';
import FoodSearch from './FoodSearch';
import { useRouter } from 'next/navigation';

interface FoodEntry {
	id: string;
	name: string;
	calories: number;
	meal: string;
	date: string;
	weight?: number;
	weightUnit?: string;
}

type UnitSystem = 'metric' | 'imperial';

export default function FoodDiary() {
	console.log('FoodDiary component started rendering');
	const { data: session } = useSession();
	const [entries, setEntries] = useState<FoodEntry[]>([]);
	const [newEntry, setNewEntry] = useState({
		name: '',
		calories: '',
		meal: 'breakfast',
		weight: '',
		weightUnit: 'g',
	});
	const { settings, updateUserSettings } = useUserSettings();
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const router = useRouter();

	useEffect(() => {
		if (settings.units !== 'imperial') {
			updateUserSettings({ units: 'imperial' });
		}
	}, [settings.units, updateUserSettings]);

	const units: UnitSystem = settings.units === 'metric' ? 'metric' : 'imperial';

	const fetchFoodEntries = useCallback(async () => {
		console.log('fetchFoodEntries started');
		if (!session) return;

		try {
			const response = await fetch('/api/food-entries', {
				credentials: 'include',
			});
			console.log('Food entries fetch response received');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log('Fetched food entries:', data);
			setEntries(data);
		} catch (error) {
			console.error('Error fetching food entries:', error);
		}
		console.log('fetchFoodEntries ended');
	}, [session]);

	useEffect(() => {
		console.log('useEffect for fetching food entries started');
		let isMounted = true;
		if (session) {
			fetchFoodEntries().then(() => {
				if (isMounted) {
					console.log('FoodDiary component finished rendering');
				}
			});
		}
		console.log('useEffect for fetching food entries ended');
		return () => {
			isMounted = false;
		};
	}, [session, fetchFoodEntries]);
	const handleAddEntry = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			// Add food entry
			const response = await fetch('/api/food-entries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...newEntry,
					date: (selectedDate || new Date()).toISOString(),
				}),
			});
			if (!response.ok) {
				throw new Error('Failed to add food entry');
			}
			const addedEntry = await response.json();
			setEntries((prev) => [...prev, addedEntry]);

			// Save user food
			const userFoodResponse = await fetch('/api/user-foods', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: newEntry.name,
					calories: Number(newEntry.calories),
					weight: newEntry.weight ? Number(newEntry.weight) : undefined,
					weightUnit: newEntry.weightUnit || undefined,
				}),
			});

			if (!userFoodResponse.ok) {
				const errorData = await userFoodResponse.json();
				console.error('Failed to save user food:', errorData);
				throw new Error('Failed to save user food');
			}

			// Clear the form
			setNewEntry({
				name: '',
				calories: '',
				meal: 'breakfast',
				weight: '',
				weightUnit: 'g',
			});
		} catch (error) {
			console.error('Error:', error);
			// Handle error (e.g., show error message to user)
		}
	};
	useEffect(() => {
		console.log('useEffect for fetching food entries started');
		if (session) {
			fetchFoodEntries();
		}
		console.log('useEffect for fetching food entries ended');
	}, [session, fetchFoodEntries]);

	const handleDeleteEntry = async (id: string) => {
		try {
			const response = await fetch(`/api/food-entries/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error('Failed to delete food entry');
			}
			setEntries((prev) => prev.filter((entry) => entry.id !== id));
		} catch (error) {
			console.error('Error deleting food entry:', error);
		}
	};

	const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewEntry((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleSelectChange = useCallback((name: string, value: string) => {
		setNewEntry((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleSelectFood = (
		name: string,
		calories: number,
		weight?: number,
		weightUnit?: string
	) => {
		setNewEntry({
			name,
			calories: calories.toString(),
			meal: newEntry.meal,
			weight: weight ? weight.toString() : '',
			weightUnit: weightUnit || 'g',
		});
	};

	const handleFinishEntries = () => {
		router.push('/dashboard/logs');
	};

	return (
		<div className='space-y-8 p-4'>
			<h1 className='text-3xl font-bold mb-4'>Food Diary</h1>

			<div className='mb-4'>
				<DatePicker
					selected={selectedDate}
					onChange={(date: Date | null) => setSelectedDate(date || new Date())}
					dateFormat='MMMM d, yyyy'
					className='p-2 border rounded'
				/>
			</div>

			<FoodSearch onSelectFood={handleSelectFood} />
			<form onSubmit={handleAddEntry} className='mb-6 space-y-4'>
				<Input
					type='text'
					name='name'
					placeholder='Food name'
					value={newEntry.name}
					onChange={handleInputChange}
					aria-label='Food name'
					className='w-full'
				/>
				<Input
					type='number'
					name='calories'
					placeholder={`Calories (${
						settings.units === 'metric' ? 'kcal' : 'Cal'
					})`}
					value={newEntry.calories}
					onChange={handleInputChange}
					aria-label='Calories'
					className='w-full'
				/>
				<div className='flex space-x-2'>
					<Input
						type='number'
						name='weight'
						placeholder='Weight'
						value={newEntry.weight}
						onChange={handleInputChange}
						aria-label='Weight'
						className='w-2/3'
					/>
					<Select
						value={newEntry.weightUnit}
						onValueChange={(value) => handleSelectChange('weightUnit', value)}
					>
						<SelectTrigger className='w-1/3'>
							<SelectValue placeholder='Unit' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='g'>g</SelectItem>
							<SelectItem value='oz'>oz</SelectItem>
							<SelectItem value='lb'>lb</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Select
					value={newEntry.meal}
					onValueChange={(value) => handleSelectChange('meal', value)}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Select meal' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='breakfast'>Breakfast</SelectItem>
						<SelectItem value='lunch'>Lunch</SelectItem>
						<SelectItem value='dinner'>Dinner</SelectItem>
						<SelectItem value='snack'>Snack</SelectItem>
					</SelectContent>
				</Select>
				<Button type='submit' className='w-full'>
					Add Food
				</Button>
			</form>
			<div className='space-y-8'>
				<FoodEntryList entries={entries} onDelete={handleDeleteEntry} />
				<NutritionSummary entries={entries} units={units} />
			</div>
			<Button onClick={handleFinishEntries} className='mt-4'>
				Finish Entries
			</Button>
		</div>
	);
}
