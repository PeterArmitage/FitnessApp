// app/dashboard/sleep/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SleepEntry from './../../components/SleepEntry';
import SleepLog from './../../components/SleepLog';
import InfoCard from './../../components/Infocard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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
interface SleepEntry {
	id: string;
	date: Date;
	sleepDuration: number;
	mood: string;
	comment: string;
}
export default function SleepAndRecovery() {
	const [entries, setEntries] = useState<SleepEntry[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [editingEntry, setEditingEntry] = useState<SleepEntry | null>(null);
	const router = useRouter();

	useEffect(() => {
		fetchEntries();
	}, []);

	async function fetchEntries() {
		const response = await fetch('/api/sleep-entries');
		if (response.ok) {
			const data = await response.json();
			setEntries(
				data.map((entry: SleepEntry) => ({
					...entry,
					date: new Date(entry.date),
				}))
			);
		}
	}

	const handleNewEntry = async (entry: Omit<SleepEntry, 'id'>) => {
		const response = await fetch('/api/sleep-entries', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(entry),
		});

		if (response.ok) {
			fetchEntries();
		}
	};
	const handleEdit = (id: string) => {
		const entryToEdit = entries.find((entry) => entry.id === id);
		if (entryToEdit) {
			setEditingEntry(entryToEdit);
		}
	};
	const handleUpdate = async (updatedEntry: SleepEntry) => {
		const response = await fetch(`/api/sleep-entries/${updatedEntry.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedEntry),
		});

		if (response.ok) {
			setEditingEntry(null);
			fetchEntries();
		}
	};
	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/sleep-entries/${id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			fetchEntries();
		}
	};

	const handleViewAllLogs = () => {
		router.push('/dashboard/logs');
	};

	const filteredCards = infoCards.filter(
		(card) =>
			card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			card.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='flex flex-col space-y-6'>
			<h1 className='text-3xl font-bold'>Sleep and Recovery</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div>
					<h2 className='text-2xl font-semibold mb-4'>Log Sleep</h2>
					<SleepEntry
						onSubmit={(entry) => {
							if (entry.id) {
								handleUpdate(entry as SleepEntry);
							} else {
								handleNewEntry(entry);
							}
						}}
						initialData={editingEntry}
					/>
				</div>
				<div>
					<h2 className='text-2xl font-semibold mb-4'>
						Sleep Log (Last 3 Days)
					</h2>
					<SleepLog
						entries={entries.slice(-3)}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
					<Button onClick={handleViewAllLogs} className='mt-4 w-full'>
						View All Logs
					</Button>
				</div>
			</div>

			<div>
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
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredCards.map((card, index) => (
						<InfoCard key={index} {...card} />
					))}
				</div>
			</div>
		</div>
	);
}
