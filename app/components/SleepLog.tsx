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
	date: string | Date; // Alterado para aceitar string ou Date
	sleepDuration: number;
	mood: string;
	comment: string;
}

interface SleepLogProps {
	entries: SleepEntry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	limit?: number;
}

export default function SleepLog({
	entries,
	onEdit,
	onDelete,
	limit,
}: SleepLogProps) {
	const displayEntries = limit ? entries.slice(0, limit) : entries;

	// Função auxiliar para formatar a data
	const formatDate = (date: string | Date): string => {
		if (typeof date === 'string') {
			return new Date(date).toLocaleDateString();
		}
		return date.toLocaleDateString();
	};

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
				{displayEntries.map((entry) => (
					<TableRow key={entry.id}>
						<TableCell>{formatDate(entry.date)}</TableCell>
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
