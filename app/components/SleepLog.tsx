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
	date: string | Date;
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

	const formatDate = (date: string | Date): string => {
		if (typeof date === 'string') {
			return new Date(date).toLocaleDateString();
		}
		return date.toLocaleDateString();
	};

	return (
		<div className='overflow-x-auto'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Sleep Duration</TableHead>
						<TableHead>Mood</TableHead>
						<TableHead className='hidden md:table-cell'>Comment</TableHead>
						<TableHead className='hidden md:table-cell'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{displayEntries.map((entry) => (
						<>
							<TableRow key={entry.id}>
								<TableCell>{formatDate(entry.date)}</TableCell>
								<TableCell>{entry.sleepDuration} hours</TableCell>
								<TableCell>{entry.mood}</TableCell>
								<TableCell className='hidden md:table-cell'>
									{entry.comment}
								</TableCell>
								<TableCell className='hidden md:table-cell'>
									<Button
										onClick={() => onEdit(entry.id)}
										variant='outline'
										size='sm'
										className='mr-2'
									>
										Edit
									</Button>
									<Button
										onClick={() => onDelete(entry.id)}
										variant='destructive'
										size='sm'
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
							<TableRow className='md:hidden'>
								<TableCell colSpan={3} className='p-2'>
									<div className='flex justify-between'>
										<Button
											onClick={() => onEdit(entry.id)}
											variant='outline'
											size='sm'
											className='w-[48%]'
										>
											Edit
										</Button>
										<Button
											onClick={() => onDelete(entry.id)}
											variant='destructive'
											size='sm'
											className='w-[48%]'
										>
											Delete
										</Button>
									</div>
								</TableCell>
							</TableRow>
						</>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
