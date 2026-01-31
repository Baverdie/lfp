import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ROLE_PERMISSIONS } from '../lib/permissions';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer les rôles
  const roles = [
    {
      name: 'super_admin',
      description: 'Accès complet à toutes les fonctionnalités',
      permissions: [...ROLE_PERMISSIONS.super_admin],
    },
    {
      name: 'admin',
      description: 'Gestion des membres, voitures et événements',
      permissions: [...ROLE_PERMISSIONS.admin],
    },
    {
      name: 'editor',
      description: 'Modification du contenu existant',
      permissions: [...ROLE_PERMISSIONS.editor],
    },
    {
      name: 'viewer',
      description: 'Consultation uniquement',
      permissions: [...ROLE_PERMISSIONS.viewer],
    },
  ];

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: { permissions: roleData.permissions, description: roleData.description },
      create: roleData,
    });
  }

  // Créer le premier super admin
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'super_admin' } });

  if (superAdminRole) {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@lfp.fr' },
      update: {},
      create: {
        name: 'Admin LFP',
        email: 'admin@lfp.fr',
        password: hashedPassword,
        roleId: superAdminRole.id,
      },
    });

    console.log(`✅ Super admin created: ${admin.email}`);
    console.log('   ⚠️  Default password: admin123 - CHANGE IT!');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
