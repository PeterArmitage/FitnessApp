import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

interface InfoCardProps {
	title: string;
	description: string;
	imageUrl: string;
	link: string;
}

export default function InfoCard({
	title,
	description,
	imageUrl,
	link,
}: InfoCardProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<Card className='overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
			<CardHeader>
				<CardTitle className='text-gray-900 dark:text-gray-100'>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{!imageError ? (
					<div className='relative w-full h-48'>
						<Image
							src={imageUrl}
							alt={title}
							width={400}
							height={200}
							layout='responsive'
							objectFit='cover'
							onError={() => setImageError(true)}
						/>
					</div>
				) : (
					<div className='w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400'>
						Image not available
					</div>
				)}
				<CardDescription className='mt-4 text-gray-600 dark:text-gray-300'>
					{description}
				</CardDescription>
			</CardContent>
			<CardFooter>
				<Button
					onClick={() => window.open(link, '_blank')}
					className='bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700'
				>
					Learn More
				</Button>
			</CardFooter>
		</Card>
	);
}
