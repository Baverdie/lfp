'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Data des voitures avec plusieurs photos + story
const cars = [
	{
		id: 1,
		model: 'BMW E36 318 TDS',
		year: '1996',
		owner: 'Enzo',
		ownerInstagram: 'https://instagram.com/enzo.sm17',
		photos: [
			'https://scontent-cdg4-3.cdninstagram.com/v/t51.82787-15/560666082_17997361379832475_2430473753541305732_n.webp?stp=dst-webp_p1080x1080&_nc_cat=110&ig_cache_key=MzczODk5NDY4ODQ3MzcxNTI5Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=Y1almnGVPuUQ7kNvwH8D0ye&_nc_oc=Adlz4fz-A5hvBzmDxG9hoiCpaBI-50k7sKwYgHjGj5fbNyMa2grTXoX-c6TWb68M1tlS03RTk87cidK4-Pne1LhJ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-3.cdninstagram.com&_nc_gid=J8-E6n9kfiS0iwESEn_jIA&oh=00_Afk80pkm9fO9ETAX00dqrjIZJhzLkC4oyIRhlKsTil8Wpw&oe=695AE111',
			'https://scontent-cdg4-1.cdninstagram.com/v/t51.82787-15/563261431_17997361352832475_2713202949941489998_n.webp?_nc_cat=104&ig_cache_key=MzczODk5NDY4ODQ4MjA4OTMwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=ZuC8sHfQbu4Q7kNvwHvBlPf&_nc_oc=AdliCNi87WxFATSAgLNw0OIBvDl1pzxIUsSzoTR5PvCQIwci5ueW_VcPxcUPczEka08vLLkymUiAosUvY84C4eph&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_gid=IaPgNo1BnoLILpwDFB9uzw&oh=00_Afot7jAB0hMBngZm9PzqptrBSvsIW0hov4kVhCZ3aredhQ&oe=695C9E96',
		],
		specs: {
			engine: '1.7L Diesel',
			power: '90ch',
			modifications: 'Suspensions sport, Jantes BBS',
		},
		story: 'Une BMW E36 dans sa plus pure essence. Châssis sport d\'origine, cette TDS offre le parfait équilibre entre économie et plaisir de conduite.',
	},
	{
		id: 2,
		model: 'Mercedes 190E',
		year: '1991',
		owner: 'Carlos',
		ownerInstagram: 'https://instagram.com/carlosps98',
		photos: [
			'https://scontent-cdg4-2.cdninstagram.com/v/t51.82787-15/581817272_18001406585832475_5935688260465934126_n.webp?_nc_cat=103&ig_cache_key=Mzc2NzI1NTEwNjM1NDcxODQ3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=z1kPXPBjEBIQ7kNvwFnTXWL&_nc_oc=Adkw07vU8LPfwyqjZkrlWR82c1I_iCn8-MpJIW_JN4BIuo23J60c8qIIPvP77LE2Mal2UOpkVpZm-kRugCedkbbh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-2.cdninstagram.com&_nc_gid=WrKBD6EPWSjA8kGs2NV9yA&oh=00_AfkssGqBpda1LTAk-N8fRo52eLREo1P824_0GyO32FU5_A&oe=695AD42C',
		],
		specs: {
			engine: '2.0L Essence',
			power: '122ch',
			modifications: 'Stock',
		},
		story: 'Icône des années 90, cette 190E incarne l\'élégance intemporelle de Mercedes-Benz. Un classique qui ne prend pas une ride.',
	},
	{
		id: 3,
		model: 'BMW E30',
		year: '1987',
		owner: 'Nathan',
		ownerInstagram: 'https://instagram.com/nathancoste',
		photos: [
			'https://scontent-cdg4-3.cdninstagram.com/v/t51.82787-15/560067280_17996812793832475_1126276156469481730_n.webp?_nc_cat=110&ig_cache_key=MzczNjgyODE5MTU3NTk2Mjg5Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxOS5zZHIuQzMifQ%3D%3D&_nc_ohc=4BPiljn4oPkQ7kNvwHfA7sG&_nc_oc=Adkp-kMDrzyf5V95lMVJ_LlqyPDWnBbDiSA9D5ACobZ-ie3bZ5nADCe3pcYYAbLes0seUxB8loqGzgXkO13MxMs9&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-3.cdninstagram.com&_nc_gid=J8-E6n9kfiS0iwESEn_jIA&oh=00_AflVUTWE7tXeg3mdL4-yHZvtOzgMdIvJ0Oat9cdtgX87ag&oe=695AD34D',
		],
		specs: {
			engine: '1.8L Essence',
			power: '113ch',
			modifications: 'Échappement sport, Coilovers',
		},
		story: 'La légende des années 80. Pure, légère, maniable. Une E30 qui respire le plaisir de conduite à l\'état brut.',
	},
	{
		id: 4,
		model: 'BMW E46 330cd',
		year: '2003',
		owner: 'Mathéo',
		ownerInstagram: 'https://instagram.com/mathrss17',
		photos: [
			'https://scontent-cdg4-1.cdninstagram.com/v/t51.82787-15/570651200_17999354567832475_4688603941538589168_n.webp?_nc_cat=108&ig_cache_key=Mzc1MjEyNDcwMzgyNjY5ODQxMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=2cnSYrw0c-wQ7kNvwEHK-b_&_nc_oc=AdnxQJYf-GuwfXvsMvuxEWsk7x7_a94KWLr2yqeW9mwDWclXfzjkTQ_HmV4tRmkNdbJLy0DciK9dI0-feifrnfD7&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_gid=WrKBD6EPWSjA8kGs2NV9yA&oh=00_AfnIFR5XjoOV1TBLrABugrxhCA3Cqmltk8UK6VnBU_IdGA&oe=695ADB60',
		],
		specs: {
			engine: '3.0L Diesel',
			power: '204ch',
			modifications: 'Reprog, Échappement',
		},
		story: 'Diesel sportif, 204ch, couple monstre. Une E46 qui allie confort et performances.',
	},
	{
		id: 5,
		model: 'BMW E34 525tds',
		year: '1996',
		owner: 'Paul',
		ownerInstagram: 'https://instagram.com/p010_benz',
		photos: [
			'https://scontent-cdg4-2.cdninstagram.com/v/t51.82787-15/523864529_17988817934832475_1484749742506263753_n.webp?_nc_cat=100&ig_cache_key=MzY4NjA1Mjk2NTY4ODM4MzU0NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=JlP2XOYxOasQ7kNvwGn9GQ_&_nc_oc=AdmVDpDkrf0WSEzf-gXrba5zRmY0XV46BterabzodtuQOVeXumBGYBl8vSQcav7-MttxzLU0OHFjDKmkBYQe4gSn&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-2.cdninstagram.com&_nc_gid=pxOwyrGawcgqzhN5bcqy_A&oh=00_Afn0mYpRyIL5Q2hbPpLBDz5-_tjPK5Xqna9mqz1DzPX1mQ&oe=695AFF8D',
		],
		specs: {
			engine: '2.5L Diesel',
			power: '143ch',
			modifications: 'Stock',
		},
		story: 'Berline familiale racée, TDS puissant. L\'élégance BMW des années 90.',
	},
	{
		id: 6,
		model: 'Volkswagen Polo 6N2',
		year: '1996',
		owner: '𝙻𝚞𝚌𝚒𝚕𝚕𝚎',
		ownerInstagram: 'https://instagram.com/lucillestm',
		photos: [
			'https://scontent-cdg4-1.cdninstagram.com/v/t51.82787-15/565139745_17998340945832475_7739485872754245078_n.webp?_nc_cat=104&ig_cache_key=Mzc0NDc5NzExNzk5NTg2MTc5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMS5zZHIuQzMifQ%3D%3D&_nc_ohc=xuOOS9hV6-IQ7kNvwFEx1p-&_nc_oc=AdmeGUM1LJzOrESpOmoxJPhfwAC4VGDZbk8skOF7Ez5YGyuwGXeuTy0Nn_MOsMjwqV9Za4qp8wPYIlpyV_5b8q1s&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_gid=J8-E6n9kfiS0iwESEn_jIA&oh=00_AfkEW0j-2Eorgq41XQpzSaGQBzDoOBMSfjsHfpUNbHM5Sg&oe=695AE7AA',
		],
		specs: {
			engine: '1.4L Essence',
			power: '60ch',
			modifications: 'Rabaissée, Jantes',
		},
		story: 'Citadine vintage, style années 90. Petite mais pleine de caractère.',
	},
	// Voitures 7-12 pour tester le pattern
	{
		id: 7,
		model: 'Audi A4 B5',
		year: '1998',
		owner: 'Test',
		ownerInstagram: 'https://instagram.com/test',
		photos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'],
		specs: {
			engine: '1.8T',
			power: '150ch',
			modifications: 'Stock',
		},
		story: 'Berline allemande élégante des années 90.',
	},
	{
		id: 8,
		model: 'Peugeot 206',
		year: '2002',
		owner: 'Test',
		ownerInstagram: 'https://instagram.com/test',
		photos: ['https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&h=600&fit=crop'],
		specs: {
			engine: '1.6L',
			power: '110ch',
			modifications: 'Échappement',
		},
		story: 'Citadine française sportive, un classique.',
	},
	{
		id: 9,
		model: 'Golf GTI MK4',
		year: '2000',
		owner: 'Test',
		ownerInstagram: 'https://instagram.com/test',
		photos: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop'],
		specs: {
			engine: '1.8T',
			power: '180ch',
			modifications: 'Stage 1',
		},
		story: 'Hot hatch iconique, performances au rendez-vous.',
	},
	{
		id: 10,
		model: 'Honda Civic EK',
		year: '1999',
		owner: 'Test',
		ownerInstagram: 'https://instagram.com/test',
		photos: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'],
		specs: {
			engine: '1.6L VTEC',
			power: '160ch',
			modifications: 'Admission, Échappement',
		},
		story: 'Compacte japonaise fiable et sportive.',
	},
	{
		id: 11,
		model: 'Seat Leon',
		year: '2004',
		owner: 'Test',
		ownerInstagram: 'https://instagram.com/test',
		photos: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop'],
		specs: {
			engine: '1.8T',
			power: '180ch',
			modifications: 'Reprog',
		},
		story: 'Sportive espagnole au tempérament affirmé.',
	},
	{
		id: 12,
		model: 'Renault Megane RS',
		year: '2006',
		owner: 'Test',
		ownerInstagram: 'https://instagram.com/test',
		photos: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop'],
		specs: {
			engine: '2.0L Turbo',
			power: '225ch',
			modifications: 'Stock',
		},
		story: 'Hot hatch français, performances exceptionnelles.',
	},
];

// Modal Component avec auto-scroll
function CarModal({ car, onClose }: { car: typeof cars[0]; onClose: () => void }) {
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const AUTO_SCROLL_DURATION = 10000;

	useEffect(() => {
		if (car.photos.length <= 1) return;
		setProgress(0);
		const startTime = performance.now();
		let animationFrameId: number;

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const newProgress = Math.min((elapsed / AUTO_SCROLL_DURATION) * 100, 100);
			setProgress(newProgress);
			if (elapsed < AUTO_SCROLL_DURATION) {
				animationFrameId = requestAnimationFrame(animate);
			} else {
				setCurrentPhotoIndex((prev) => (prev + 1) % car.photos.length);
			}
		};

		animationFrameId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrameId);
	}, [car.photos.length, currentPhotoIndex]);

	const nextPhoto = () => {
		setCurrentPhotoIndex((prev) => (prev + 1) % car.photos.length);
	};

	const prevPhoto = () => {
		setCurrentPhotoIndex((prev) => (prev - 1 + car.photos.length) % car.photos.length);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
			className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center"
		>
			{/* Bouton fermer - RESPONSIVE */}
			<button
				onClick={onClose}
				className="fixed top-4 right-4 md:top-8 md:right-8 z-[220] w-10 h-10 md:w-12 md:h-12 rounded-full bg-lfp-green/10 hover:bg-lfp-green/20 flex items-center justify-center transition-all duration-300"
			>
				<svg className="w-5 h-5 md:w-6 md:h-6 text-lfp-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			{/* Contenu modal - RESPONSIVE flex-col mobile / flex-row desktop */}
			<motion.div
				initial={{ scale: 0.98, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.98, opacity: 0 }}
				transition={{ duration: 0.3 }}
				onClick={(e) => e.stopPropagation()}
				className="relative w-full h-full max-w-[1800px] mx-auto flex flex-col md:flex-row"
			>
				{/* Photos - RESPONSIVE : 50vh mobile / 100% height desktop */}
				<div className="relative w-full md:w-[60%] h-[50vh] md:h-full bg-black group/photo">
					{/* Barre de progression */}
					{car.photos.length > 1 && (
						<div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
							<div className="h-full bg-lfp-green bg-white" style={{ width: `${progress}%` }} />
						</div>
					)}

					{/* Bouton Instagram - RESPONSIVE : haut gauche mobile / haut droite desktop */}
					<motion.a
						href={car.ownerInstagram}
						target="_blank"
						rel="noopener noreferrer"
						whileHover={{ scale: 1.05 }}
						className="absolute top-4 left-4 md:top-6 md:left-auto md:right-6 z-30 md:opacity-0 md:group-hover/photo:opacity-100 transition-all duration-300 inline-flex items-center gap-2 md:gap-3 bg-black/80 backdrop-blur-md border border-white/20 hover:border-lfp-green text-white py-2 px-4 md:py-3 md:px-5 rounded-full text-sm"
						onClick={(e) => e.stopPropagation()}
					>
						<svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
						</svg>
						<span className="font-light">@{car.owner}</span>
					</motion.a>

					{/* Image actuelle */}
					<div className="relative w-full h-full">
						<AnimatePresence initial={false}>
							<motion.div
								key={currentPhotoIndex}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
								className="absolute inset-0"
							>
								<Image
									src={car.photos[currentPhotoIndex]}
									alt={`${car.model} - ${currentPhotoIndex + 1}`}
									fill
									sizes="(max-width: 768px) 100vw, 60vw"
									className="object-cover"
									priority
								/>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Flèches - plus petites sur mobile */}
					{car.photos.length > 1 && (
						<>
							<button
								onClick={prevPhoto}
								className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:border-lfp-green hover:bg-lfp-green/10 transition-all duration-300"
							>
								<svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								onClick={nextPhoto}
								className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:border-lfp-green hover:bg-lfp-green/10 transition-all duration-300"
							>
								<svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</>
					)}

					{/* Indicateurs - plus petits sur mobile */}
					{car.photos.length > 1 && (
						<div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
							{car.photos.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentPhotoIndex(index)}
									className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${index === currentPhotoIndex ? 'bg-lfp-green w-6 md:w-8' : 'bg-white/30 w-1.5 md:w-2 hover:bg-white/50'
										}`}
								/>
							))}
						</div>
					)}
				</div>

				{/* Infos - RESPONSIVE : 50vh mobile / 40% desktop */}
				<div className="w-full md:w-[40%] h-[50vh] md:h-full p-6 md:p-12 overflow-y-auto bg-gradient-to-b from-[#141414] to-[#0a0a0a]">
					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mb-8 md:mb-12">
						<h2 className="text-4xl md:text-6xl font-display text-white mb-3 md:mb-4 tracking-wider leading-tight">{car.model}</h2>
						<p className="text-2xl md:text-3xl text-lfp-green font-light">{car.year}</p>
					</motion.div>

					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="mb-8 md:mb-12">
						<div className="w-12 h-px bg-lfp-green/30 mb-4 md:mb-6" />
						<p className="text-gray-300 text-base md:text-lg leading-relaxed">{car.story}</p>
					</motion.div>

					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mb-8 md:mb-12">
						<h3 className="text-white/40 text-xs uppercase tracking-[0.3em] mb-6 md:mb-8 font-light">Spécifications</h3>
						<div className="space-y-4 md:space-y-6">
							<div>
								<span className="text-white/50 text-xs md:text-sm block mb-2">Moteur</span>
								<span className="text-white text-xl md:text-2xl font-light">{car.specs.engine}</span>
							</div>
							<div>
								<span className="text-white/50 text-xs md:text-sm block mb-2">Puissance</span>
								<span className="text-white text-xl md:text-2xl font-light">{car.specs.power}</span>
							</div>
							<div>
								<span className="text-white/50 text-xs md:text-sm block mb-2">Modifications</span>
								<span className="text-white text-lg md:text-xl font-light">{car.specs.modifications}</span>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default function Garage() {
	const [selectedCar, setSelectedCar] = useState<typeof cars[0] | null>(null);
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const patterns = [];
	for (let i = 0; i < cars.length; i += 6) {
		patterns.push(cars.slice(i, Math.min(i + 6, cars.length)));
	}

	return (
		<section id="garage" className="grain-bg relative py-16 md:py-32 px-4 md:px-6 lg:px-12 bg-black">
			{/* Header - RESPONSIVE */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
				className="mb-12 md:mb-20 text-center"
			>
				<div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
					<span className="text-xl md:text-2xl lg:text-3xl text-lfp-green font-light">──</span>
					<h2 className="text-4xl md:text-5xl lg:text-7xl font-display text-white tracking-[0.2em]">LE GARAGE</h2>
					<span className="text-xl md:text-2xl lg:text-3xl text-lfp-green font-light">──</span>
				</div>
				<p className="text-gray-400 text-base md:text-xl">Les bolides du crew 🏁</p>
			</motion.div>

			{/* Gallery - RESPONSIVE (garde le pattern desktop, stack mobile) */}
			<div ref={ref} className="max-w-7xl mx-auto space-y-4 md:space-y-6">
				{patterns.map((patternCars, patternIndex) => (
					<div key={patternIndex} className="space-y-4 md:space-y-6">
						{/* Image 1 - full width */}
						{patternCars[0] && (
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
								transition={{ duration: 0.6, delay: patternIndex * 6 * 0.1 }}
								className="relative w-full h-[40vh] md:h-[50vh] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
								onClick={() => setSelectedCar(patternCars[0])}
							>
								<Image
									src={patternCars[0].photos[0]}
									alt={patternCars[0].model}
									fill
									sizes="(max-width: 768px) 100vw, 80vw"
									className="object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
								<div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
									<h3 className="text-2xl md:text-4xl font-display text-white mb-1 md:mb-2">{patternCars[0].model}</h3>
									<p className="text-base md:text-xl text-lfp-green">{patternCars[0].year}</p>
								</div>
								<div className="absolute inset-0 border-2 border-transparent group-hover:border-lfp-green rounded-xl md:rounded-2xl transition-colors duration-500" />
							</motion.div>
						)}

						{/* Images 2-3 - grid 2 colonnes */}
						{(patternCars[1] || patternCars[2]) && (
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
								transition={{ duration: 0.6, delay: (patternIndex * 6 + 1) * 0.1 }}
								className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
							>
								{patternCars[1] && (
									<div
										className="relative h-[35vh] md:h-[40vh] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
										onClick={() => setSelectedCar(patternCars[1])}
									>
										<Image
											src={patternCars[1].photos[0]}
											alt={patternCars[1].model}
											fill
											sizes="(max-width: 768px) 100vw, 40vw"
											className="object-cover group-hover:scale-105 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
										<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
											<h3 className="text-xl md:text-3xl font-display text-white mb-1">{patternCars[1].model}</h3>
											<p className="text-sm md:text-lg text-lfp-green">{patternCars[1].year}</p>
										</div>
										<div className="absolute inset-0 border-2 border-transparent group-hover:border-lfp-green rounded-xl md:rounded-2xl transition-colors duration-500" />
									</div>
								)}
								{patternCars[2] && (
									<div
										className="relative h-[35vh] md:h-[40vh] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
										onClick={() => setSelectedCar(patternCars[2])}
									>
										<Image
											src={patternCars[2].photos[0]}
											alt={patternCars[2].model}
											fill
											sizes="(max-width: 768px) 100vw, 40vw"
											className="object-cover group-hover:scale-105 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
										<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
											<h3 className="text-xl md:text-3xl font-display text-white mb-1">{patternCars[2].model}</h3>
											<p className="text-sm md:text-lg text-lfp-green">{patternCars[2].year}</p>
										</div>
										<div className="absolute inset-0 border-2 border-transparent group-hover:border-lfp-green rounded-xl md:rounded-2xl transition-colors duration-500" />
									</div>
								)}
							</motion.div>
						)}

						{/* Images 4-5-6 - L-shape (stack mobile) */}
						{(patternCars[3] || patternCars[4] || patternCars[5]) && (
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
								transition={{ duration: 0.6, delay: (patternIndex * 6 + 3) * 0.1 }}
								className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
							>
								<div className="space-y-4 md:space-y-6">
									{patternCars[3] && (
										<div
											className="relative h-[30vh] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
											onClick={() => setSelectedCar(patternCars[3])}
										>
											<Image
												src={patternCars[3].photos[0]}
												alt={patternCars[3].model}
												fill
												sizes="(max-width: 768px) 100vw, 40vw"
												className="object-cover group-hover:scale-105 transition-transform duration-700"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
											<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
												<h3 className="text-lg md:text-2xl font-display text-white mb-1">{patternCars[3].model}</h3>
												<p className="text-sm md:text-lg text-lfp-green">{patternCars[3].year}</p>
											</div>
											<div className="absolute inset-0 border-2 border-transparent group-hover:border-lfp-green rounded-xl md:rounded-2xl transition-colors duration-500" />
										</div>
									)}
									{patternCars[4] && (
										<div
											className="relative h-[30vh] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
											onClick={() => setSelectedCar(patternCars[4])}
										>
											<Image
												src={patternCars[4].photos[0]}
												alt={patternCars[4].model}
												fill
												sizes="(max-width: 768px) 100vw, 40vw"
												className="object-cover group-hover:scale-105 transition-transform duration-700"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
											<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
												<h3 className="text-lg md:text-2xl font-display text-white mb-1">{patternCars[4].model}</h3>
												<p className="text-sm md:text-lg text-lfp-green">{patternCars[4].year}</p>
											</div>
											<div className="absolute inset-0 border-2 border-transparent group-hover:border-lfp-green rounded-xl md:rounded-2xl transition-colors duration-500" />
										</div>
									)}
								</div>
								{patternCars[5] && (
									<div
										className="relative h-[30vh] md:h-full rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
										onClick={() => setSelectedCar(patternCars[5])}
									>
										<Image
											src={patternCars[5].photos[0]}
											alt={patternCars[5].model}
											fill
											sizes="(max-width: 768px) 100vw, 40vw"
											className="object-cover group-hover:scale-105 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
										<div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
											<h3 className="text-xl md:text-3xl font-display text-white mb-1 md:mb-2">{patternCars[5].model}</h3>
											<p className="text-base md:text-xl text-lfp-green">{patternCars[5].year}</p>
										</div>
										<div className="absolute inset-0 border-2 border-transparent group-hover:border-lfp-green rounded-xl md:rounded-2xl transition-colors duration-500" />
									</div>
								)}
							</motion.div>
						)}
					</div>
				))}
			</div>

			<AnimatePresence>{selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />}</AnimatePresence>

			<div className="grain" />
		</section>
	);
}