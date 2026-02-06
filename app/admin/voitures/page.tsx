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
}

interface Car {
  id: string;
  model: string;
  year: string;
  photos: string[];
  containPhotos: number[];
  engine: string;
  power: string;
  modifications: string;
  story: string;
  memberId: string;
  member: Member;
  order: number;
  isActive: boolean;
}

// Modal de confirmation custom
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, title, message, confirmText = 'Confirmer', danger = false, onConfirm, onCancel }: ConfirmModalProps) {
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
            Annuler
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

function VoituresContent() {
  const { data: session } = useSession();
  const [cars, setCars] = useState<Car[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    model: '',
    year: '',
    photos: [] as string[],
    containPhotos: [] as number[],
    engine: '',
    power: '',
    modifications: '',
    story: '',
    memberId: '',
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
  const canCreate = hasPermission(userPermissions, PERMISSIONS.CARS_CREATE);
  const canEdit = hasPermission(userPermissions, PERMISSIONS.CARS_EDIT);
  const canDelete = hasPermission(userPermissions, PERMISSIONS.CARS_DELETE);

  const fetchData = async () => {
    try {
      const [carsRes, membersRes] = await Promise.all([
        fetch('/api/admin/cars'),
        fetch('/api/admin/members'),
      ]);

      if (carsRes.ok) {
        const data = await carsRes.json();
        setCars(data.cars);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingCar ? `/api/admin/cars/${editingCar.id}` : '/api/admin/cars';
    const method = editingCar ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingCar(null);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      model: '',
      year: '',
      photos: [],
      containPhotos: [],
      engine: '',
      power: '',
      modifications: '',
      story: '',
      memberId: '',
    });
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      model: car.model,
      year: car.year,
      photos: car.photos || [],
      containPhotos: car.containPhotos || [],
      engine: car.engine,
      power: car.power,
      modifications: car.modifications,
      story: car.story,
      memberId: car.memberId,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string, model: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer la voiture',
      message: `Voulez-vous vraiment supprimer "${model}" ?`,
      confirmText: 'Supprimer',
      danger: true,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));

        try {
          const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
          if (res.ok) {
            fetchData();
          } else {
            const data = await res.json();
            alert(data.error || 'Erreur lors de la suppression');
          }
        } catch (error) {
          console.error('Error deleting car:', error);
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
          <h1 className="text-7xl font-black text-white mb-2">Voitures</h1>
          <p className="text-gray-400">Gérer les voitures du garage</p>
        </div>
        {canCreate && (
          <button
            onClick={() => {
              setEditingCar(null);
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-white/50 hover:bg-white text-black cursor-pointer font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une voiture
          </button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-8 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-display text-white mb-6">
              {editingCar ? 'Modifier la voiture' : 'Nouvelle voiture'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Modèle</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    placeholder="BMW E30 316"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Année</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    placeholder="1988"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Propriétaire</label>
                <select
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
                >
                  <option value="">Sélectionner un membre</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Moteur</label>
                  <input
                    type="text"
                    value={formData.engine}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    placeholder="1.6L 4 cylindres"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Puissance</label>
                  <input
                    type="text"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    placeholder="102 ch"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Modifications</label>
                <textarea
                  value={formData.modifications}
                  onChange={(e) => setFormData({ ...formData, modifications: e.target.value })}
                  rows={4}
                  placeholder={"Suspension KW V3\nÉchappement custom\nAdmission carbone\n..."}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Une modification par ligne</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Histoire</label>
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  rows={3}
                  placeholder="L'histoire de cette voiture..."
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-lfp-green resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Photos</label>
                <ImageUpload
                  value={formData.photos}
                  onChange={(photos) => {
                    const newPhotos = photos as string[];
                    // Nettoyer containPhotos pour ne garder que les index valides
                    const validContainPhotos = formData.containPhotos.filter(
                      (index) => index < newPhotos.length
                    );
                    setFormData({
                      ...formData,
                      photos: newPhotos,
                      containPhotos: validContainPhotos
                    });
                  }}
                  multiple
                  folder="lfp/cars"
                />
              </div>

              {/* Options d'affichage des photos */}
              {formData.photos.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Mode d&apos;affichage des photos
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Activez &quot;Contenir&quot; pour les photos qui ne doivent pas être recadrées (ex: photos en portrait)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {formData.photos.map((photo, index) => {
                      const isContain = formData.containPhotos.includes(index);
                      return (
                        <div
                          key={index}
                          className="relative bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden"
                        >
                          <div className="relative h-24">
                            <Image
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              fill
                              className={isContain ? "object-contain" : "object-cover"}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newContainPhotos = isContain
                                ? formData.containPhotos.filter((i) => i !== index)
                                : [...formData.containPhotos, index];
                              setFormData({ ...formData, containPhotos: newContainPhotos });
                            }}
                            className={`w-full px-2 py-1.5 text-xs transition-colors cursor-pointer ${
                              isContain
                                ? 'bg-lfp-green text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {isContain ? 'Contenir' : 'Couvrir'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white cursor-pointer rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white/50 hover:bg-white text-black cursor-pointer rounded-lg transition-colors"
                >
                  {editingCar ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-400 py-12">Chargement...</div>
        ) : cars.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">Aucune voiture</div>
        ) : (
          cars.map((car) => (
            <div
              key={car.id}
              className={`bg-[#141414] border rounded-xl overflow-hidden ${
                car.isActive ? 'border-white/10' : 'border-red-500/30 opacity-60'
              }`}
            >
              {/* Photo */}
              <div className="relative h-48 bg-black">
                {car.photos[0] ? (
                  <Image
                    src={car.photos[0]}
                    alt={car.model}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    Pas de photo
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="px-2 py-1 bg-black/60 text-white text-xs rounded">
                    {car.photos.length} photos
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-display text-white mb-1">{car.model}</h3>
                <p className="text-lfp-green text-sm mb-2">{car.year}</p>
                <p className="text-gray-400 text-sm mb-4">
                  Propriétaire: {car.member?.name || 'N/A'}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(car)}
                      className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors cursor-pointer"
                    >
                      Modifier
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(car.id, car.model)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors cursor-pointer"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function VoituresPage() {
  return (
    <AdminLayout>
      <VoituresContent />
    </AdminLayout>
  );
}
