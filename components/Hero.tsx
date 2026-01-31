'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
	const [displayText, setDisplayText] = useState('');
	const [isTypingComplete, setIsTypingComplete] = useState(false);
	const [showBackground, setShowBackground] = useState(false);
	const [showScrollIndicator, setShowScrollIndicator] = useState(false);
	const [showNav, setShowNav] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);
	const fullText = 'LA FORÊT PERFORMANCE';
	const mobileText = 'LFP';

	const { scrollY } = useScroll();

	const titleScale = useTransform(scrollY, [0, 300], [1, 0.4]);
	const titleY = useTransform(scrollY, [0, 300], [0, typeof window !== 'undefined' ? -(window.innerHeight / 2 - 50) : -350]);
	const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

	// Gradient noir qui apparaît en haut quand le titre monte (desktop uniquement)
	const topGradientOpacity = useTransform(scrollY, [100, 300], [0, 1]);

	// Gérer le scroll pour mobile
	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Calculer position et scale du titre mobile
	const getMobileTitlePosition = () => {
		const maxScroll = 150; // Réduit pour une transition plus rapide
		const progress = Math.min(scrollPosition / maxScroll, 1);

		// Calcule la distance exacte pour atteindre la navbar
		const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
		const navbarHeight = 60; // Hauteur approximative de ta navbar

		const startY = 0;
		const endY = -(viewportHeight / 2 - navbarHeight / 2 - 10); // Ajuste pour centrer dans la navbar
		const currentY = startY + (endY - startY) * progress;

		const startScale = 1;
		const endScale = 0.55; // Taille finale dans la navbar
		const currentScale = startScale + (endScale - startScale) * progress;

		return { y: currentY, scale: currentScale };
	};

	const mobileTitlePos = getMobileTitlePosition();

	useEffect(() => {
		const textToType = window.innerWidth < 768 ? mobileText : fullText;
		const startTyping = setTimeout(() => {
			let currentIndex = 0;
			const typingInterval = setInterval(() => {
				if (currentIndex <= textToType.length) {
					setDisplayText(textToType.slice(0, currentIndex));
					currentIndex++;
				} else {
					setIsTypingComplete(true);
					clearInterval(typingInterval);
					setTimeout(() => {
						setShowBackground(true);
						setTimeout(() => {
							setShowNav(true);
						}, 500);
						setTimeout(() => {
							setShowScrollIndicator(true);
						}, 2000);
					}, 500);
				}
			}, 80);
		}, 600);

		return () => clearTimeout(startTyping);
	}, []);

	return (
		<>
			{/* Navbar mobile - slide depuis le haut APRÈS typing */}
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{
					y: showNav ? 0 : -100,
					opacity: showNav ? 1 : 0
				}}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className="md:hidden fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-90"
				style={{
					paddingTop: 'max(env(safe-area-inset-top), 0px)',
				}}
			>
				<div className="flex items-center justify-between px-6 py-4">
					{/* Logo E30 */}
					<div className="w-10 h-10 rounded-full bg-lfp-green/10 border border-lfp-green/30 flex items-center justify-center">
						<Image
							src="/images/logo/LFP.pdf"
							alt="LFP"
							width={36}
							height={36}
							className="object-cover rounded-full"
						/>
					</div>

					{/* Instagram */}
					<a
						href="https://instagram.com/la.foret.performance"
						target="_blank"
						rel="noopener noreferrer"
						className="text-white hover:text-lfp-green transition-colors"
					>
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
						</svg>
					</a>
				</div>
			</motion.nav>

			{/* Gradient noir desktop uniquement */}
			<motion.div
				style={{ opacity: topGradientOpacity }}
				className="hidden md:block fixed top-0 left-0 right-0 h-24 md:h-28 bg-linear-to-b from-black via-black/80 to-transparent z-40 pointer-events-none"
			/>

			<section
				id='hero'
				className="grain-bg relative h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]"
			>
				{/* Background image */}
				<motion.div
					initial={{ opacity: 0, scale: 1.1 }}
					animate={{
						opacity: showBackground ? 1 : 0,
						scale: showBackground ? 1 : 1.1
					}}
					transition={{ duration: 2, ease: 'easeOut' }}
					className="absolute inset-0"
				>
					{/* Mobile image */}
					<div className="md:hidden absolute inset-0">
						<Image
							src="https://oh7qghmltywp4luq.public.blob.vercel-storage.com/group/group-4.jpg"
							alt="La Forêt Performance"
							fill
							sizes="100vw"
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />
						<div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/40" />
					</div>
					{/* Desktop/tablet image */}
					<div className="hidden md:block absolute inset-0">
						<Image
							src="https://oh7qghmltywp4luq.public.blob.vercel-storage.com/group/group-3.jpg"
							alt="La Forêt Performance"
							fill
							sizes="100vw"
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />
						<div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/40" />
					</div>
				</motion.div>

				{/* Titre MOBILE - monte au scroll vers la navbar (PAS motion.div) */}
				<div
					style={{
						transform: `translate(-50%, -50%) translateY(${mobileTitlePos.y}px) scale(${mobileTitlePos.scale})`,
						transition: 'transform 0.1s ease-out',
					}}
					className="md:hidden fixed top-1/2 left-1/2 z-100 text-center px-4"
				>
					<div className="flex items-center justify-center gap-2">
						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{ opacity: 1, scaleX: 1 }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
							className="origin-right"
						>
							<span
								className="text-2xl text-lfp-green font-light"
								style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}
							>
								──
							</span>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.3 }}
						>
							<h1
								className="text-4xl font-landasans font-display text-white tracking-[0.2em] whitespace-nowrap"
								style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.5)' }}
							>
								{displayText === fullText ? mobileText : displayText.slice(0, 3)}
								{displayText.length > 0 && displayText.length < 3 && !isTypingComplete && (
									<motion.span
										animate={{ opacity: [1, 0] }}
										transition={{ duration: 0.5, repeat: Infinity }}
										className="text-lfp-green"
									>
										|
									</motion.span>
								)}
							</h1>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{ opacity: 1, scaleX: 1 }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
							className="origin-left"
						>
							<span
								className="text-2xl text-lfp-green font-light"
								style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}
							>
								──
							</span>
						</motion.div>
					</div>
				</div>

				{/* Titre DESKTOP */}
				<motion.div
					style={{
						scale: titleScale,
						y: titleY
					}}
					className="hidden md:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center px-4"
				>
					<div className="flex items-center justify-center gap-4">
						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{ opacity: 1, scaleX: 1 }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
							className="origin-right"
						>
							<span
								className="text-4xl lg:text-6xl text-lfp-green font-light"
								style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}
							>
								──
							</span>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.3 }}
							className="min-w-25"
						>
							<h1
								className="text-5xl font-landasans lg:text-7xl text-white tracking-[0.15em] whitespace-nowrap"
								style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.5)' }}
							>
								{displayText}
								{displayText.length > 0 && !isTypingComplete && (
									<motion.span
										animate={{ opacity: [1, 0] }}
										transition={{ duration: 0.5, repeat: Infinity }}
										className="text-lfp-green"
									>
										|
									</motion.span>
								)}
							</h1>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{ opacity: 1, scaleX: 1 }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
							className="origin-left"
						>
							<span
								className="text-4xl lg:text-6xl text-lfp-green font-light"
								style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}
							>
								──
							</span>
						</motion.div>
					</div>
				</motion.div>

				{/* Scroll indicator */}
				{showScrollIndicator && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						style={{ opacity: scrollIndicatorOpacity }}
						className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2"
					>
						<div className="flex flex-col items-center gap-2">
							<span
								className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-light"
								style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)' }}
							>
								Scroll
							</span>
							<div className="w-4 h-7 md:w-5 md:h-8 border border-gray-400 rounded-full flex justify-center pt-1.5 backdrop-blur-sm bg-black/20">
								<motion.div
									animate={{ y: [0, 8, 0] }}
									transition={{
										repeat: Infinity,
										duration: 1.5,
										ease: 'easeInOut'
									}}
									className="w-1 h-1.5 md:h-2 bg-gray-400 rounded-full"
								/>
							</div>
						</div>
					</motion.div>
				)}

				<div className="grain" />
			</section>
		</>
	);
}