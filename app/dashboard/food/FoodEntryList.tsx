/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Button } from '@/components/ui/button';

interface FoodEntry {
	id: string;
	name: string;
	calories: number;
	meal: string;
	date: string;
}

interface FoodEntryListProps {
	entries: FoodEntry[];
	onDelete: (id: string) => void;
}

const FoodEntryList: React.FC<FoodEntryListProps> = ({ entries, onDelete }) => {
	const handleDelete = (id: string) => {
		onDelete(id);
	};
	return (
		<div className='mt-6'>
			<h2 className='text-2xl font-semibold mb-4'>Today's Entries</h2>
			{entries.length === 0 ? (
				<p>No food entries for today. Start adding your meals!</p>
			) : (
				<ul className='space-y-4'>
					{entries.map((entry) => (
						<li
							key={entry.id}
							className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center'
						>
							<div>
								<h3 className='font-semibold'>{entry.name}</h3>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									{entry.calories} calories - {entry.meal}
								</p>
							</div>
							<Button
								onClick={() => handleDelete(entry.id)}
								variant='destructive'
								size='sm'
								aria-label={`Delete ${entry.name}`}
							>
								Delete
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default FoodEntryList;
