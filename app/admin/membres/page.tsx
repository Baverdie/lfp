'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import Image from 'next/image';

interface Member {
	id: string;
	name: string;
	instagram: string;
	photo: string;
	bio: string;
	order: number;
	isActive: boolean;
	cars: any[];
}

// Modal de confirmation custom
interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	danger?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

function ConfirmModal({ isOpen, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', danger = false, onConfirm, onCancel }: ConfirmModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
			<div className="bg-[#141414] border border-white/10 rounded-xl p-6 w-full max-w-md">
				<h3 className="text-xl font-display text-white mb-2">{title}</h3>
				<p className="text-gray-400 mb-6 whitespace-pre-line">{message}</p>
				<div className="flex gap-3">
					<button
						onClick={onCancel}
						className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className={`flex-1 px-4 py-2 rounded-lg transition-colors ${danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-gray-200 text-black'}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}

function MembresContent() {
	const { data: session } = useSession();
	const [members, setMembers] = useState<Member[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingMember, setEditingMember] = useState<Member | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		instagram: '',
		photo: '',
		bio: '',
	});

	// État pour le modal de confirmation
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		confirmText?: string;
		danger?: boolean;
		onConfirm: () => void;
	}>({
		isOpen: false,
		title: '',
		message: '',
		onConfirm: () => {},
	});

	const userPermissions = session?.user?.permissions || [];
	const canCreate = hasPermission(userPermissions, PERMISSIONS.MEMBERS_CREATE);
	const canEdit = hasPermission(userPermissions, PERMISSIONS.MEMBERS_EDIT);
	const canDelete = hasPermission(userPermissions, PERMISSIONS.MEMBERS_DELETE);

	const fetchMembers = async () => {
		try {
			const res = await fetch('/api/admin/members');
			if (res.ok) {
				const data = await res.json();
				setMembers(data.members);
			}
		} catch (error) {
			console.error('Error fetching members:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMembers();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const url = editingMember
		? `/api/admin/members/${editingMember.id}`
		: '/api/admin/members';

		const method = editingMember ? 'PUT' : 'POST';
		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				setShowForm(false);
				setEditingMember(null);
				setFormData({ name: '', instagram: '', photo: '', bio: '' });
				fetchMembers();
			}
		} catch (error) {
			console.error('Error saving member:', error);
		}
	};

	const handleEdit = (member: Member) => {
		setEditingMember(member);
		setFormData({
		name: member.name,
		instagram: member.instagram,
		photo: member.photo,
		bio: member.bio,
		});
		setShowForm(true);
	};

	const handleToggleActive = (member: Member) => {
		const action = member.isActive ? 'suspendre' : 'réactiver';

		setConfirmModal({
			isOpen: true,
			title: member.isActive ? 'Suspendre le membre' : 'Réactiver le membre',
			message: `Voulez-vous vraiment ${action} ${member.name} ?`,
			confirmText: member.isActive ? 'Suspendre' : 'Réactiver',
			danger: member.isActive,
			onConfirm: async () => {
				setConfirmModal(prev => ({ ...prev, isOpen: false }));

				try {
					const res = await fetch(`/api/admin/members/${member.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ isActive: !member.isActive }),
					});

					if (res.ok) {
						fetchMembers();
					} else {
						const data = await res.json();
						alert(data.error || 'Erreur lors du changement de statut');
					}
				} catch (error) {
					console.error('Fetch error:', error);
					alert('Erreur de connexion au serveur');
				}
			},
		});
	};

	const handleDelete = (id: string, name: string) => {
		setConfirmModal({
			isOpen: true,
			title: '⚠️ Suppression définitive',
			message: `Voulez-vous vraiment SUPPRIMER DÉFINITIVEMENT ${name} ?\n\nCette action est IRRÉVERSIBLE et supprimera également toutes ses voitures.`,
			confirmText: 'Supprimer',
			danger: true,
			onConfirm: async () => {
				setConfirmModal(prev => ({ ...prev, isOpen: false }));

				try {
					const res = await fetch(`/api/admin/members/${id}?permanent=true`, { method: 'DELETE' });

					if (res.ok) {
						fetchMembers();
					} else {
						const data = await res.json();
						alert(data.error || 'Erreur lors de la suppression');
					}
				} catch (error) {
					console.error('Fetch error:', error);
					alert('Erreur de connexion au serveur');
				}
			},
		});
	};

	return (
		<div>
			{/* Modal de confirmation */}
			<ConfirmModal
				isOpen={confirmModal.isOpen}
				title={confirmModal.title}
				message={confirmModal.message}
				confirmText={confirmModal.confirmText}
				danger={confirmModal.danger}
				onConfirm={confirmModal.onConfirm}
				onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
			/>

			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
				<h1 className="text-7xl font-black font-display text-white mb-2">Membres</h1>
				<p className="text-gray-400">Gérer les membres du crew</p>
				</div>
				{canCreate && (
				<button
					onClick={() => {
					setEditingMember(null);
					setFormData({ name: '', instagram: '', photo: '', bio: '' });
					setShowForm(true);
						}}
					className="px-4 py-2 cursor-pointer border border-white/30 hover:bg-white text-white hover:text-black rounded-lg transition-all duration-300 ease-in-out flex items-center gap-2"
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Ajouter un membre
				</button>
				)}
			</div>

			{/* Form Modal */}
			{showForm && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto w-full h-full" onClick={() => setShowForm(false)}>
					<div className="bg-[#141414] border border-white/10 rounded-xl p-8 w-full max-w-2xl mt-9 my-8" onClick={(e) => e.stopPropagation()}>
						<h2 className="text-2xl font-display text-white mb-6">
							{editingMember ? 'Modifier le membre' : 'Nouveau membre'}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className='flex w-full justify-around'>
								<div className='w-1/2'>
									<label className="block text-sm text-gray-400 mb-2">Nom</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										required
										className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
										/>
								</div>
								<div className='w-1/2 pl-4'>
									<label className="block text-sm text-gray-400 mb-2">Instagram (sans @)</label>
									<input
										type="text"
										value={formData.instagram}
										onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
										required
										className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm text-gray-400 mb-2">Photo</label>
								<ImageUpload
									value={formData.photo}
									onChange={(photo) => setFormData({ ...formData, photo: photo as string })}
									folder="lfp/crew"
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-400 mb-2">Bio</label>
								<textarea
									value={formData.bio}
									onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
									rows={3}
									className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green resize-none"
								/>
							</div>
							<div className="flex gap-4 pt-4">
								<button
									type="button"
									onClick={() => setShowForm(false)}
									className="flex-1 px-4 py-3 border border-white/10 text-white/10 hover:text-white hover:border-white font-bold cursor-pointer rounded-lg transition-all duration-300 ease-in-out"
								>
									Annuler
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-3 bg-white/50 text-black hover:bg-white border hover:border-white border-white/10 font-bold cursor-pointer rounded-lg transition-all duration-300 ease-in-out"
								>
									{editingMember ? 'Enregistrer' : 'Créer'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Members Table */}
			<div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
				{isLoading ? (
				<div className="p-8 text-center text-gray-400">Chargement...</div>
				) : members.length === 0 ? (
				<div className="p-8 text-center text-gray-400">Aucun membre</div>
				) : (
				<table className="w-full">
					<thead>
						<tr className="border-b border-white/10">
							<th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Membre</th>
							<th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Instagram</th>
							<th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">Voitures</th>
							<th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">Statut</th>
							<th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{members.map((member) => (
							<tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
								<td className="px-6 py-4">
									<div className="flex items-center gap-3">
										{member.photo ? (
											<Image
											src={member.photo}
											alt={member.name}
											width={40}
											height={40}
											className="w-10 h-10 rounded-full object-cover"
											/>
										) : (
											<div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
												<span className="text-white font-medium">
													{member.name.charAt(0).toUpperCase()}
												</span>
											</div>
										)}
										<span className="text-white font-medium">{member.name}</span>
									</div>
								</td>
								<td className="px-6 py-4 text-gray-400 text-left">@{member.instagram}</td>
								<td className="px-6 py-4 text-gray-400 text-center">{member.cars?.length || 0}</td>
								<td className="px-6 py-4 text-center">
									<span className={`px-2 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
										{member.isActive ? 'Actif' : 'Suspendu'}
									</span>
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center justify-end gap-2">
										{canEdit && (
											<button
												onClick={() => handleEdit(member)}
												className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
												title="Modifier"
											>
												<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
											</button>
										)}
										{canEdit && (
											<button
												onClick={() => handleToggleActive(member)}
												className={`p-2 rounded-lg transition-colors cursor-pointer ${member.isActive ? 'hover:bg-yellow-500/10' : 'hover:bg-green-500/10'}`}
												title={member.isActive ? 'Suspendre' : 'Réactiver'}
											>
												{member.isActive ? (
													<svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
													</svg>
												) : (
													<svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
												)}
											</button>
										)}
										{canDelete && (
											<button
												onClick={() => handleDelete(member.id, member.name)}
												className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
												title="Supprimer définitivement"
											>
												<svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				)}
			</div>
		</div>
	);
}

export default function MembresPage() {
  return (
	<AdminLayout>
	  <MembresContent />
	</AdminLayout>
  );
}
