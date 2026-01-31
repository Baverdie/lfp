// Liste de toutes les permissions disponibles
export const PERMISSIONS = {
  // Members
  MEMBERS_VIEW: 'MEMBERS_VIEW',
  MEMBERS_CREATE: 'MEMBERS_CREATE',
  MEMBERS_EDIT: 'MEMBERS_EDIT',
  MEMBERS_DELETE: 'MEMBERS_DELETE',

  // Cars
  CARS_VIEW: 'CARS_VIEW',
  CARS_CREATE: 'CARS_CREATE',
  CARS_EDIT: 'CARS_EDIT',
  CARS_DELETE: 'CARS_DELETE',

  // Events
  EVENTS_VIEW: 'EVENTS_VIEW',
  EVENTS_CREATE: 'EVENTS_CREATE',
  EVENTS_EDIT: 'EVENTS_EDIT',
  EVENTS_DELETE: 'EVENTS_DELETE',

  // Photos
  PHOTOS_UPLOAD: 'PHOTOS_UPLOAD',
  PHOTOS_DELETE: 'PHOTOS_DELETE',

  // Users
  USERS_VIEW: 'USERS_VIEW',
  USERS_CREATE: 'USERS_CREATE',
  USERS_EDIT: 'USERS_EDIT',
  USERS_DELETE: 'USERS_DELETE',

  // Logs
  LOGS_VIEW: 'LOGS_VIEW',

  // Settings
  SETTINGS_EDIT: 'SETTINGS_EDIT',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Rôles prédéfinis avec leurs permissions
export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS), // Toutes les permissions

  admin: [
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.MEMBERS_CREATE,
    PERMISSIONS.MEMBERS_EDIT,
    PERMISSIONS.CARS_VIEW,
    PERMISSIONS.CARS_CREATE,
    PERMISSIONS.CARS_EDIT,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.EVENTS_CREATE,
    PERMISSIONS.EVENTS_EDIT,
    PERMISSIONS.PHOTOS_UPLOAD,
    PERMISSIONS.LOGS_VIEW,
  ],

  editor: [
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.MEMBERS_EDIT,
    PERMISSIONS.CARS_VIEW,
    PERMISSIONS.CARS_EDIT,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.EVENTS_EDIT,
    PERMISSIONS.PHOTOS_UPLOAD,
  ],

  viewer: [
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.CARS_VIEW,
    PERMISSIONS.EVENTS_VIEW,
  ],
} as const;

// Helper pour vérifier si un utilisateur a une permission
export function hasPermission(userPermissions: string[], permission: Permission): boolean {
  return userPermissions.includes(permission);
}

// Helper pour vérifier si un utilisateur a au moins une des permissions
export function hasAnyPermission(userPermissions: string[], permissions: Permission[]): boolean {
  return permissions.some(p => userPermissions.includes(p));
}

// Helper pour vérifier si un utilisateur a toutes les permissions
export function hasAllPermissions(userPermissions: string[], permissions: Permission[]): boolean {
  return permissions.every(p => userPermissions.includes(p));
}

// Groupes de permissions pour l'affichage dans l'admin
export const PERMISSION_GROUPS = {
  Membres: [
    { key: PERMISSIONS.MEMBERS_VIEW, label: 'Voir les membres' },
    { key: PERMISSIONS.MEMBERS_CREATE, label: 'Créer des membres' },
    { key: PERMISSIONS.MEMBERS_EDIT, label: 'Modifier les membres' },
    { key: PERMISSIONS.MEMBERS_DELETE, label: 'Supprimer des membres' },
  ],
  Voitures: [
    { key: PERMISSIONS.CARS_VIEW, label: 'Voir les voitures' },
    { key: PERMISSIONS.CARS_CREATE, label: 'Créer des voitures' },
    { key: PERMISSIONS.CARS_EDIT, label: 'Modifier les voitures' },
    { key: PERMISSIONS.CARS_DELETE, label: 'Supprimer des voitures' },
  ],
  Événements: [
    { key: PERMISSIONS.EVENTS_VIEW, label: 'Voir les événements' },
    { key: PERMISSIONS.EVENTS_CREATE, label: 'Créer des événements' },
    { key: PERMISSIONS.EVENTS_EDIT, label: 'Modifier les événements' },
    { key: PERMISSIONS.EVENTS_DELETE, label: 'Supprimer des événements' },
  ],
  Photos: [
    { key: PERMISSIONS.PHOTOS_UPLOAD, label: 'Uploader des photos' },
    { key: PERMISSIONS.PHOTOS_DELETE, label: 'Supprimer des photos' },
  ],
  Utilisateurs: [
    { key: PERMISSIONS.USERS_VIEW, label: 'Voir les utilisateurs' },
    { key: PERMISSIONS.USERS_CREATE, label: 'Créer des utilisateurs' },
    { key: PERMISSIONS.USERS_EDIT, label: 'Modifier les utilisateurs' },
    { key: PERMISSIONS.USERS_DELETE, label: 'Supprimer des utilisateurs' },
  ],
  Système: [
    { key: PERMISSIONS.LOGS_VIEW, label: 'Voir les logs' },
    { key: PERMISSIONS.SETTINGS_EDIT, label: 'Modifier les paramètres' },
  ],
};
