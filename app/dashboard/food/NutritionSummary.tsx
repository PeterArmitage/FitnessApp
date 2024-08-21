import React from 'react';

interface FoodEntry {
	id: string;
	name: string;
	calories: number;
	meal: string;
	date: string;
}
interface NutritionSummaryProps {
	entries: FoodEntry[];
	units: UnitSystem;
}
type UnitSystem = 'metric' | 'imperial';
const NutritionSummary: React.FC<NutritionSummaryProps> = ({
	entries,
	units,
}) => {
	const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
	const calorieUnit = units === 'metric' ? 'kcal' : 'Cal';

	const mealTotals = entries.reduce((totals, entry) => {
		totals[entry.meal] = (totals[entry.meal] || 0) + entry.calories;
		return totals;
	}, {} as Record<string, number>);

	return (
		<div className='mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
			<h2 className='text-2xl font-semibold mb-4'>Nutrition Summary</h2>
			<p className='text-3xl font-bold mb-4'>
				Total Calories: {totalCalories} {calorieUnit}
			</p>
			<div className='grid grid-cols-2 gap-4'>
				{Object.entries(mealTotals).map(([meal, calories]) => (
					<div key={meal} className='bg-gray-100 dark:bg-gray-700 p-3 rounded'>
						<h3 className='font-semibold capitalize'>{meal}</h3>
						<p>
							{calories} {calorieUnit}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default NutritionSummary;
