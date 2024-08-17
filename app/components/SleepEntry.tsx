// components/SleepEntry.tsx
import { useState } from 'react';
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

interface SleepEntryProps {
	onSubmit: (entry: {
		date: Date | undefined;
		sleepDuration: string;
		mood: string;
		comment: string;
	}) => void;
}
export default function SleepEntry({ onSubmit }: SleepEntryProps) {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [sleepDuration, setSleepDuration] = useState('');
	const [mood, setMood] = useState('');
	const [comment, setComment] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ date, sleepDuration, mood, comment });
		// Reset form fields
		setDate(new Date());
		setSleepDuration('');
		setMood('');
		setComment('');
	};
	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<Calendar
				mode='single'
				selected={date}
				onSelect={setDate}
				className='rounded-md border'
			/>
			<Input
				type='number'
				placeholder='Sleep duration (hours)'
				value={sleepDuration}
				onChange={(e) => setSleepDuration(e.target.value)}
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
			<Button type='submit'>Log Sleep</Button>
		</form>
	);
}
