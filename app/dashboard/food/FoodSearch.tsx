'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FoodItem {
	name: string;
	calories: number;
	serving_size_g: number;
	protein_g: number;
	fat_total_g: number;
	carbohydrates_total_g: number;
}
interface UserFood {
	id: string;
	name: string;
	calories: number;
}

interface FoodSearchProps {
	onSelectFood: (name: string, calories: number) => void;
}

export default function FoodSearch({ onSelectFood }: FoodSearchProps) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<FoodItem[]>([]);
	useEffect(() => {
		const fetchFoods = async () => {
			if (query.length < 2) {
				setResults([]);
				return;
			}

			try {
				const response = await fetch(
					`/api/user-foods?query=${encodeURIComponent(query)}`
				);
				if (!response.ok) {
					throw new Error('Failed to fetch user foods');
				}
				const data = await response.json();
				setResults(data);
			} catch (error) {
				console.error('Error fetching user foods:', error);
			}
		};

		const debounce = setTimeout(fetchFoods, 300);
		return () => clearTimeout(debounce);
	}, [query]);
	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`/api/food-search?query=${encodeURIComponent(query)}`
			);
			setResults(response.data);
		} catch (error) {
			console.error('Error searching for food:', error);
		}
	};

	return (
		<div className='space-y-4'>
			<div className='flex space-x-2'>
				<Input
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search for a food...'
					className='flex-grow'
				/>
				<Button onClick={handleSearch}>Search</Button>
			</div>
			<ul className='space-y-2'>
				{results.map((food, index) => (
					<li key={index} className='flex justify-between items-center'>
						<span>
							{food.name} ({food.serving_size_g}g)
						</span>
						<div>
							<span className='mr-2'>{food.calories} cal</span>
							<Button onClick={() => onSelectFood(food.name, food.calories)}>
								Add
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
