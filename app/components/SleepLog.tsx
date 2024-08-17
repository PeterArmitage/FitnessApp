// components/SleepLog.tsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface SleepEntry {
	id: string;
	date: Date;
	sleepDuration: number;
	mood: string;
	comment: string;
}

interface SleepLogProps {
	entries: SleepEntry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export default function SleepLog({ entries, onEdit, onDelete }: SleepLogProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Sleep Duration</TableHead>
					<TableHead>Mood</TableHead>
					<TableHead>Comment</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{entries.map((entry) => (
					<TableRow key={entry.id}>
						<TableCell>{entry.date.toLocaleDateString()}</TableCell>
						<TableCell>{entry.sleepDuration} hours</TableCell>
						<TableCell>{entry.mood}</TableCell>
						<TableCell>{entry.comment}</TableCell>
						<TableCell>
							<Button onClick={() => onEdit(entry.id)}>Edit</Button>
							<Button onClick={() => onDelete(entry.id)} variant='destructive'>
								Delete
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
