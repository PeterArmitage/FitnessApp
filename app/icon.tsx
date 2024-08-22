import { ImageResponse } from 'next/og';

export const size = {
	width: 32,
	height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					background: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='24'
					height='24'
					fill='none'
					stroke='#ffffff'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					{/* Left weight */}
					<circle cx='4' cy='12' r='3' />
					<circle cx='8' cy='12' r='2' />

					{/* Bar */}
					<line x1='10' y1='12' x2='14' y2='12' />

					{/* Right weight */}
					<circle cx='16' cy='12' r='2' />
					<circle cx='20' cy='12' r='3' />
				</svg>
			</div>
		),
		{ ...size }
	);
}
