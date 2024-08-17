// app/dashboard/sleep/page.tsx
'use client';

import { useState } from 'react';
import SleepEntry from './../../components/SleepEntry';
import SleepLog from './../../components/SleepLog';
import InfoCard from './../../components/Infocard';
import { Input } from '@/components/ui/input';

const infoCards = [
	{
		title: 'Better Sleep Habits',
		description: 'Learn about habits that can improve your sleep quality.',
		imageUrl:
			'https://images.unsplash.com/photo-1520206183501-b80df61043c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
		link: 'https://www.sleepfoundation.org/articles/healthy-sleep-habits',
	},
	{
		title: 'Recovery Techniques',
		description: 'Discover effective recovery techniques for athletes.',
		imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
		link: 'https://www.verywellfit.com/ways-to-speed-recovery-after-exercise-3120085',
	},
	// Add more info cards as needed
];
interface SleepEntryData {
	id: string;
	date: Date | undefined;
	sleepDuration: string;
	mood: string;
	comment: string;
}
export default function SleepAndRecovery() {
	const [entries, setEntries] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

	const handleNewEntry = (entry: Omit<SleepEntryData, 'id'>) => {
		const newEntry = { ...entry, id: Date.now().toString() };
		setEntries([newEntry, ...entries]);
	};
	const handleEdit = (id: string) => {
		// TODO: Implement edit functionality
	};

	const handleDelete = (id: string) => {
		setEntries(entries.filter((entry) => entry.id !== id));
	};

	const filteredCards = infoCards.filter(
		(card) =>
			card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			card.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			<h1 className='text-3xl font-bold mb-6'>Sleep and Recovery</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div>
					<h2 className='text-2xl font-semibold mb-4'>Log Sleep</h2>
					<SleepEntry onSubmit={handleNewEntry} />
				</div>
				<div>
					<h2 className='text-2xl font-semibold mb-4'>Sleep Log</h2>
					<SleepLog
						entries={entries}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>
			</div>

			<div className='mt-12'>
				<h2 className='text-2xl font-semibold mb-4'>
					Sleep and Recovery Resources
				</h2>
				<Input
					type='text'
					placeholder='Search resources...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='mb-4'
				/>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredCards.map((card, index) => (
						<InfoCard key={index} {...card} />
					))}
				</div>
			</div>
		</>
	);
}
