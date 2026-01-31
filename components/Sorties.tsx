'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import type { PublicEvent } from '@/lib/data';

// Formater la date en français
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

// Composant pour une carte de sortie
function SortieCard({ event, index, isLeft }: { event: PublicEvent; index: number; isLeft: boolean }) {
	const isPast = event.status === 'past';

	return (
		<motion.div
			initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, margin: '-50px' }}
			transition={{ duration: 0.6, delay: index * 0.1 }}
			className={`relative flex w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-center`}
		>
			{/* Carte */}
			<div className={`relative w-full md:w-[45%] ${isPast ? 'bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f]' : 'bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f] border border-gray-500/30'} rounded-xl overflow-hidden group`}>
				{/* Photo pour les sorties passées */}
				{isPast && event.photo && (
					<div className="relative h-48 overflow-hidden">
						<Image
							src={event.photo}
							alt={event.title}
							fill
							sizes="(max-width: 768px) 100vw, 45vw"
							className="object-cover group-hover:scale-105 transition-transform duration-700"
						/>
						<div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] to-transparent" />
					</div>
				)}

				{/* Badge à venir */}
				{!isPast && (
					<div className="absolute top-4 right-4 bg-lfp-green text-white text-xs font-bold px-3 py-1 rounded-full">
						À VENIR
					</div>
				)}

				{/* Contenu */}
				<div className="p-6">
					{/* Date */}
					<p className={`text-sm mb-2 ${isPast ? 'text-gray-500' : 'text-lfp-green'}`}>
						{formatDate(event.date)}
					</p>

					{/* Titre */}
					<h3 className={`text-2xl font-display mb-2 ${isPast ? 'text-white' : 'text-lfp-green'}`}>
						{event.title}
					</h3>

					{/* Lieu */}
					<div className="flex items-center gap-2 mb-4">
						<svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span className="text-gray-400 text-sm">{event.location}</span>
					</div>

					{/* Description */}
					<p className="text-gray-400 text-sm leading-relaxed">
						{event.description}
					</p>
				</div>
			</div>

			{/* Point sur la timeline (visible en desktop) */}
			<div className={`hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 ${isPast ? 'bg-white border-gray-600' : 'bg-lfp-green border-lfp-green/50 shadow-[0_0_20px_5px_rgba(45,80,22,0.5)]'} z-10`} />
		</motion.div>
	);
}

interface SortiesProps {
	events: PublicEvent[];
}

export default function Sorties({ events }: SortiesProps) {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	// Séparer les sorties passées et à venir
	const pastEvents = events.filter(e => e.status === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	const upcomingEvents = events.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	// Combiner : d'abord les prochaines, puis les passées
	const allEvents = [...upcomingEvents, ...pastEvents];

	return (
		<section id="sorties" className="grain-bg relative py-16 md:py-32 px-4 md:px-6 lg:px-12 bg-[#0a0a0a] overflow-hidden">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
				className="mb-12 md:mb-20 text-center"
			>
				<div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
					<span className="text-xl md:text-2xl lg:text-3xl font-light">──</span>
					<h2 className="text-4xl md:text-5xl lg:text-7xl font-landasans text-white tracking-widest">LES SORTIES</h2>
					<span className="text-xl md:text-2xl lg:text-3xl font-light">──</span>
				</div>
				<p className="text-gray-400 text-base md:text-xl">Les aventures passées et à venir du crew</p>
			</motion.div>

			{/* Timeline */}
			<div ref={ref} className="relative max-w-5xl mx-auto">
				{/* Ligne verticale centrale (visible en desktop) */}
				<div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-white/50 via-zinc-700 to-zinc-800" />

				{/* Cartes */}
				<div className="space-y-8 md:space-y-12">
					{allEvents.map((event, index) => (
						<SortieCard
							key={event.id}
							event={event}
							index={index}
							isLeft={index % 2 === 0}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
