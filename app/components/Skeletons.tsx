export function CardSkeleton() {
	return (
		<div className='animate-pulse'>
			<div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
			<div className='h-32 bg-gray-200 rounded'></div>
		</div>
	);
}

export function ChartSkeleton() {
	return (
		<div className='animate-pulse'>
			<div className='h-64 bg-gray-200 rounded'></div>
		</div>
	);
}

export function ListSkeleton() {
	return (
		<div className='animate-pulse space-y-2'>
			{[...Array(5)].map((_, i) => (
				<div key={i} className='h-4 bg-gray-200 rounded w-full'></div>
			))}
		</div>
	);
}
