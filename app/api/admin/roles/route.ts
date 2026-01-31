import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import prisma from '@/lib/prisma';

// GET - Liste des rôles
export async function GET(request: NextRequest) {
  const { error, session } = await checkAuth(PERMISSIONS.USERS_VIEW);
  if (error) return error;

  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un rôle (super_admin uniquement)
export async function POST(request: NextRequest) {
  const { error, session } = await checkAuth();
  if (error) return error;

  // Seul super_admin peut créer des rôles
  if (session!.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Permission refusée' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !permissions) {
      return NextResponse.json({ error: 'Nom et permissions requis' }, { status: 400 });
    }

    // Vérifier que le nom n'existe pas déjà
    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return NextResponse.json({ error: 'Ce nom de rôle existe déjà' }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: {
        name,
        description: description || '',
        permissions,
      },
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
