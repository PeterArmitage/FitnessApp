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
		<Card className='overflow-hidden'>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
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
					<div className='w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500'>
						Image not available
					</div>
				)}
				<CardDescription className='mt-4'>{description}</CardDescription>
			</CardContent>
			<CardFooter>
				<Button onClick={() => window.open(link, '_blank')}>Learn More</Button>
			</CardFooter>
		</Card>
	);
}
