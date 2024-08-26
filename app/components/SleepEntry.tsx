// components/SleepEntry.tsx
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const moodOptions = [
	{ value: 'great', label: 'Great', icon: '😄' },
	{ value: 'good', label: 'Good', icon: '🙂' },
	{ value: 'okay', label: 'Okay', icon: '😐' },
	{ value: 'bad', label: 'Bad', icon: '😕' },
	{ value: 'terrible', label: 'Terrible', icon: '😢' },
];
interface SleepEntryData {
	date: Date;
	sleepDuration: number;
	mood: string;
	comment: string;
}

interface SleepEntryProps {
	onSubmit: (entry: SleepEntryData & { id?: string }) => void;
	initialData?: (SleepEntryData & { id: string }) | null;
}

export default function SleepEntry({ onSubmit, initialData }: SleepEntryProps) {
	const [date, setDate] = useState<Date>(new Date());
	const [sleepDuration, setSleepDuration] = useState<number>(0);
	const [mood, setMood] = useState('');
	const [comment, setComment] = useState('');

	useEffect(() => {
		if (initialData) {
			setDate(new Date(initialData.date));
			setSleepDuration(initialData.sleepDuration);
			setMood(initialData.mood);
			setComment(initialData.comment);
		}
	}, [initialData]);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (date) {
			const entryData: SleepEntryData & { id?: string } = {
				date,
				sleepDuration,
				mood,
				comment,
			};

			if (initialData) {
				entryData.id = initialData.id;
			}

			onSubmit(entryData);

			// Reset form fields if it's not an edit
			if (!initialData) {
				setDate(new Date());
				setSleepDuration(0);
				setMood('');
				setComment('');
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<Calendar
				mode='single'
				selected={date}
				onSelect={(newDate) => newDate && setDate(newDate)}
				className='rounded-md border'
			/>
			<Input
				type='number'
				placeholder='Sleep duration (hours)'
				value={sleepDuration}
				onChange={(e) => setSleepDuration(Number(e.target.value))}
			/>
			<Select onValueChange={setMood} value={mood}>
				<SelectTrigger>
					<SelectValue placeholder='Select mood' />
				</SelectTrigger>
				<SelectContent>
					{moodOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.icon} {option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Textarea
				placeholder='Any comments?'
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>
			<Button type='submit'>
				{initialData ? 'Update Sleep' : 'Log Sleep'}
			</Button>
		</form>
	);
}
