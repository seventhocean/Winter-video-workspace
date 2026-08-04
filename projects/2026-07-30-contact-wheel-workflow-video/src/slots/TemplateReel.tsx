import {Video} from '@remotion/media';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const clamp = {
	extrapolateLeft: 'clamp' as const,
	extrapolateRight: 'clamp' as const,
};

export const TemplateReel = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const titleOpacity = interpolate(frame, [4, 20], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const titleX = interpolate(frame, [4, 22], [-56, 0], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const subtitleOpacity = interpolate(frame, [15, 32], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const deviceOpacity = interpolate(frame, [0, 18], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const deviceY = interpolate(frame, [0, 24], [70, 0], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const deviceScale = interpolate(frame, [0, 24], [0.94, 1], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const scanY = interpolate(frame, [18, durationInFrames - 8], [-120, 900], {
		...clamp,
		easing: Easing.inOut(Easing.quad),
	});
	const accentWidth = interpolate(frame, [8, 30], [0, 168], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const pulse = interpolate(
		frame % 54,
		[0, 27, 54],
		[0.28, 0.68, 0.28],
		clamp,
	);
	const exitOpacity = interpolate(
		frame,
		[durationInFrames - 10, durationInFrames - 1],
		[1, 0],
		clamp,
	);

	return (
		<AbsoluteFill
			style={{
				overflow: 'hidden',
				background:
					'radial-gradient(circle at 77% 45%, rgba(34, 211, 238, 0.16) 0%, rgba(8, 16, 31, 0) 39%), linear-gradient(135deg, #050914 0%, #081221 50%, #030711 100%)',
				color: '#F7FAFF',
				fontFamily:
					'"PingFang SC", "Microsoft YaHei", Inter, Arial, sans-serif',
				opacity: exitOpacity,
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage:
						'linear-gradient(rgba(82, 195, 255, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(82, 195, 255, 0.055) 1px, transparent 1px)',
					backgroundSize: '78px 78px',
					maskImage:
						'linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.15))',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: 116,
					top: 118,
					width: 12,
					height: 844,
					borderRadius: 999,
					background:
						'linear-gradient(180deg, rgba(34,211,238,0), #22D3EE 26%, #7C3AED 70%, rgba(124,58,237,0))',
					opacity: 0.6,
				}}
			/>

			<div
				style={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: '100%',
					height: '100%',
					boxSizing: 'border-box',
					padding: '104px 118px 104px 166px',
					gap: 72,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						width: 730,
						minWidth: 0,
						opacity: titleOpacity,
						translate: `${titleX}px 0px`,
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							marginBottom: 30,
							color: '#67E8F9',
							fontSize: 28,
							fontWeight: 700,
							letterSpacing: 7,
						}}
					>
						<span
							style={{
								width: accentWidth,
								height: 3,
								borderRadius: 999,
								background:
									'linear-gradient(90deg, #22D3EE, rgba(34,211,238,0.08))',
							}}
						/>
						CONTACT WHEEL
					</div>

					<div
						style={{
							fontSize: 94,
							fontWeight: 800,
							lineHeight: 1.12,
							letterSpacing: -4,
							textShadow: '0 18px 48px rgba(0, 0, 0, 0.42)',
						}}
					>
						模板一
						<span style={{color: '#5EE6F3'}}>｜</span>
						<br />
						竖向轮播
					</div>

					<div
						style={{
							marginTop: 42,
							fontSize: 39,
							fontWeight: 550,
							lineHeight: 1.55,
							letterSpacing: 1.5,
							color: 'rgba(224, 237, 255, 0.78)',
							opacity: subtitleOpacity,
						}}
					>
						连续滑动
						<span style={{color: '#22D3EE', margin: '0 16px'}}>·</span>
						多轮循环
						<span style={{color: '#22D3EE', margin: '0 16px'}}>·</span>
						减速定位
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							marginTop: 54,
							opacity: subtitleOpacity,
						}}
					>
						{[0, 1, 2].map((index) => (
							<div
								key={index}
								style={{
									width: index === 2 ? 76 : 20,
									height: 8,
									borderRadius: 999,
									background:
										index === 2
											? 'linear-gradient(90deg, #22D3EE, #8B5CF6)'
											: 'rgba(178, 213, 237, 0.24)',
								}}
							/>
						))}
					</div>
				</div>

				<div
					style={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 720,
						height: 872,
						opacity: deviceOpacity,
						translate: `0px ${deviceY}px`,
						scale: deviceScale,
					}}
				>
					<div
						style={{
							position: 'absolute',
							width: 580,
							height: 770,
							borderRadius: '50%',
							background: '#22D3EE',
							filter: 'blur(118px)',
							opacity: pulse * 0.25,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							width: 610,
							height: 880,
							border: '1px solid rgba(90, 226, 245, 0.16)',
							borderRadius: 56,
							rotate: '-4deg',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							width: 610,
							height: 880,
							border: '1px solid rgba(139, 92, 246, 0.18)',
							borderRadius: 56,
							rotate: '4deg',
						}}
					/>

					<div
						style={{
							position: 'relative',
							width: 478,
							height: 866,
							boxSizing: 'border-box',
							padding: 18,
							borderRadius: 48,
							background:
								'linear-gradient(145deg, rgba(232,248,255,0.28), rgba(19,39,62,0.8) 14%, rgba(3,8,18,0.96) 58%, rgba(80,44,145,0.72))',
							border: '1px solid rgba(180, 236, 255, 0.38)',
							boxShadow:
								'0 42px 100px rgba(0,0,0,0.62), 0 0 0 8px rgba(5,12,24,0.8), 0 0 72px rgba(34,211,238,0.16)',
						}}
					>
						<div
							style={{
								position: 'absolute',
								zIndex: 3,
								top: 29,
								left: '50%',
								width: 104,
								height: 22,
								borderRadius: 999,
								background: 'rgba(2, 6, 15, 0.92)',
								translate: '-50% 0px',
							}}
						/>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '100%',
								overflow: 'hidden',
								borderRadius: 32,
								background: '#02050B',
							}}
						>
							<Video
								src={staticFile('template-reel-intj.mp4')}
								muted
								objectFit="contain"
								style={{
									width: '100%',
									height: '100%',
									backgroundColor: '#02050B',
								}}
							/>
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: scanY,
									height: 130,
									background:
										'linear-gradient(180deg, rgba(34,211,238,0), rgba(34,211,238,0.11), rgba(34,211,238,0))',
									mixBlendMode: 'screen',
									pointerEvents: 'none',
								}}
							/>
						</div>
					</div>

					<div
						style={{
							position: 'absolute',
							right: 8,
							bottom: 46,
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							padding: '13px 20px',
							borderRadius: 999,
							background: 'rgba(6, 16, 30, 0.88)',
							border: '1px solid rgba(103, 232, 249, 0.34)',
							boxShadow: '0 14px 36px rgba(0,0,0,0.35)',
							color: '#CFFAFE',
							fontSize: 24,
							fontWeight: 700,
							letterSpacing: 1,
						}}
					>
						<span
							style={{
								width: 10,
								height: 10,
								borderRadius: '50%',
								background: '#22D3EE',
								boxShadow: `0 0 ${12 + pulse * 16}px #22D3EE`,
							}}
						/>
						9:16 原比例
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
