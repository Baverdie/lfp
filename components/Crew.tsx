'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Data des membres
const crewMembers = [
	{
		id: 1,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 2,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 3,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 4,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 5,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 6,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 7,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	},
	{
		id: 8,
		name: 'Paul',
		pseudo: 'p010_benz',
		car: 'Mercedes 190E',
		instagram: 'https://instagram.com/p010_benz',
		photo: '/images/crew/paul.jpg',
	}
];

// Wrapper pour créer un useInView par ligne
function CrewRowWrapper({ members }: { members: typeof crewMembers }) {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
		rootMargin: '-40% 0px -40% 0px',
	});

	return (
		<div ref={ref} className="col-span-full grid grid-cols-subgrid gap-8">
			{members.map((member, index) => (
				<motion.div
					key={member.id}
					initial={{ opacity: 0, y: 50 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{
						duration: 0.6,
						delay: index * 0.15,
						ease: 'easeOut',
					}}
					className="group relative aspect-3/4 overflow-hidden rounded-3xl cursor-pointer shadow-2xl"
				>
					{/* Image plein écran */}
					<div className="absolute inset-0">
						<Image
							src={member.photo}
							alt={member.name}
							fill
							sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
							className="object-cover group-hover:scale-110 transition-transform duration-700"
						/>

						{/* Gradient overlay */}
						<div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent group-hover:from-black transition-all duration-500" />
					</div>

					{/* Contenu en overlay */}
					<div className="relative h-full flex flex-col justify-end px-8 py-4 z-10">

						{/* Nom */}
						<h3 className="text-4xl font-display text-white mb-2 group-hover:text-lfp-green transition-colors duration-300">
							{member.name}
						</h3>

						{/* Pseudo */}
					<a
						href={member.instagram}
						target="_blank"
						rel="noopener noreferrer"
						className="text-base text-gray-400 mb-2 hover:text-lfp-green duration-300 hover:underline transition-all"
						>
						@{member.pseudo}
					</a>

					{/* Voiture */}
					<div className="flex items-start gap-2">
						<svg
							className="w-5 h-5 text-lfp-green shrink-0"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
							<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
						</svg>
						<span className="text-white font-semibold text-base">
							{member.car}
						</span>
					</div>
				</div>

					{/* Border au hover */ }
				< div className = "absolute inset-0 border-4 border-transparent group-hover:border-lfp-green rounded-3xl transition-colors duration-500 pointer-events-none" />
				</motion.div>
	))
}
		</div >
	);
}

export default function Crew() {
	const [columns, setColumns] = useState(3);

	useEffect(() => {
		const updateColumns = () => {
			if (window.innerWidth < 640) setColumns(1);
			else if (window.innerWidth < 1024) setColumns(2);
			else if (window.innerWidth < 1280) setColumns(3);
			else setColumns(4);
		};

		updateColumns();
		window.addEventListener('resize', updateColumns);
		return () => window.removeEventListener('resize', updateColumns);
	}, []);

	// Grouper les membres par ligne
	const rows: typeof crewMembers[] = [];
	for (let i = 0; i < crewMembers.length; i += columns) {
		rows.push(crewMembers.slice(i, i + columns));
	}

	return (
		<section id="crew" className="grain-bg relative py-32 px-6 w-full md:px-12 bg-[#0a0a0a] overflow-hidden">
			<div className="mx-auto">
				{/* Titre section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-20 text-center"
				>
					<div className="flex items-center justify-center gap-4 mb-8">
						<span className="text-2xl md:text-3xl text-lfp-green font-light">──</span>
						<h2 className="text-5xl md:text-7xl font-display text-white tracking-[0.2em]">
							LE CREW
						</h2>
						<span className="text-2xl md:text-3xl text-lfp-green font-light">──</span>
					</div>
					<p className="text-gray-400 text-xl">
						Les passionnés qui font vivre LFP 🏁
					</p>
				</motion.div>

				{/* Grid membres par ligne */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{rows.map((row, rowIndex) => (
						<CrewRowWrapper key={rowIndex} members={row} />
					))}
				</div>

				{/* Message pour les futurs membres */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5, duration: 0.8 }}
					className="mt-20 text-center"
				>
					<p className="text-gray-500 text-lg">
						Tu veux rejoindre le crew ? Suis-nous sur{' '}
					<a
						href="https://instagram.com/la.foret.performance"
						target="_blank"
						rel="noopener noreferrer"
						className="text-lfp-green hover:underline font-semibold"
						>
						Instagram
					</a>
				</p>
			</motion.div>
		</div>

			{/* Grain texture */ }
	<div className="grain" />
		</section >
	);
}