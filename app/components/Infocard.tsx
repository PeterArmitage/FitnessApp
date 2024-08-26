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
		<Card className='overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-purple-900 border border-gray-200 dark:border-gray-700'>
			<CardHeader>
				<CardTitle className='text-white'>{title}</CardTitle>
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
				<CardDescription className='mt-4 text-white'>
					{description}
				</CardDescription>
			</CardContent>
			<CardFooter>
				<Button
					onClick={() => window.open(link, '_blank')}
					className='bg-white text-blue-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700'
				>
					Learn More
				</Button>
			</CardFooter>
		</Card>
	);
}
