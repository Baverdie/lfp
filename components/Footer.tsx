'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="grain-bg relative bg-[#0a0a0a] border-t border-lfp-green/20 overflow-hidden">
			{/* Contenu principal */}
			<div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

					{/* Colonne 1 : Logo + Description */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center gap-4 mb-6">
							<div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-lfp-green">
								<Image
									src="https://oh7qghmltywp4luq.public.blob.vercel-storage.com/logo-lfp.jpg"
									alt="LFP"
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
									className="object-cover"
								/>
							</div>
							<div>
								<h3 className="text-2xl font-display text-white tracking-wider">
									LA FORÊT
								</h3>
								<p className="text-lg font-display text-lfp-green tracking-wider">
									PERFORMANCE
								</p>
							</div>
						</div>
						<p className="text-gray-400 text-sm leading-relaxed">
							Pâturages et belles mécaniques en Charente-Maritime
						</p>
					</motion.div>

					{/* Colonne 2 : Navigation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<h4 className="text-white font-display text-xl mb-6 tracking-wider">
							Navigation
						</h4>
						<nav className="flex flex-col gap-3">
							<a
								href="#hero"
								className="text-gray-400 hover:text-lfp-green transition-colors duration-300 text-sm w-fit hover:underline"
									>
								Accueil
							</a>
							<a
								href="#crew"
								className="text-gray-400 hover:text-lfp-green transition-colors duration-300 text-sm w-fit hover:underline"
									>
								Le Crew
							</a>
							<a
								href="#garage"
								className="text-gray-400 hover:text-lfp-green transition-colors duration-300 text-sm w-fit hover:underline"
										>
								Le Garage
							</a>
							<a
								href="#sorties"
								className="text-gray-400 hover:text-lfp-green transition-colors duration-300 text-sm w-fit hover:underline"
							>
								Les Sorties
							</a>
						</nav>
					</motion.div>

					{/* Colonne 3 : Social */ }
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<h4 className="text-white font-display text-xl mb-6 tracking-wider">
							Suivez-nous
						</h4>
						<a
							href="https://instagram.com/la.foret.performance"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_5px_transparent] hover:shadow-pink-500/50 font-semibold text-sm"
											>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
							</svg>
							<span>@la.foret.performance</span>
						</a>
					</motion.div >
				</div >

				{/* Séparateur */ }
				< div className = "border-t border-lfp-green/20 pt-4" >
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						{/* Copyright */}
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-gray-500 text-sm text-center md:text-left"
						>
							© {currentYear} La Forêt Performance. Site créé avec passion 🏁
						</motion.p>

						{/* Crédit */}
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-gray-500 text-xs"
						>
							Développé par{' '}
							<a href="https://baverdie.dev" target="_blank" rel="noopener noreferrer" className="text-gray-500 font-semibold hover:underline">
										Baverdie
									</a>
						</motion.p>
					</div>
				</div >
			</div >

			{/* Grain texture */ }
			< div className = "grain" />
		</footer >
	);
}