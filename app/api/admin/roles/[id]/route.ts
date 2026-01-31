import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import prisma from '@/lib/prisma';

// GET - Détails d'un rôle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth();
  if (error) return error;

  // Seul super_admin peut voir les détails des rôles
  if (session!.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Permission refusée' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true } },
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Modifier un rôle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth();
  if (error) return error;

  // Seul super_admin peut modifier les rôles
  if (session!.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Permission refusée' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, permissions } = body;

    // Vérifier que le rôle existe
    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }

    // Ne pas permettre de modifier le rôle super_admin
    if (existingRole.name === 'super_admin') {
      return NextResponse.json({ error: 'Le rôle super_admin ne peut pas être modifié' }, { status: 400 });
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (name && name !== existingRole.name) {
      const nameExists = await prisma.role.findUnique({ where: { name } });
      if (nameExists) {
        return NextResponse.json({ error: 'Ce nom de rôle existe déjà' }, { status: 400 });
      }
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(permissions && { permissions }),
      },
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un rôle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth();
  if (error) return error;

  // Seul super_admin peut supprimer les rôles
  if (session!.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Permission refusée' }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Vérifier que le rôle existe
    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!role) {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }

    // Ne pas permettre de supprimer les rôles par défaut
    const protectedRoles = ['super_admin', 'admin', 'editor', 'viewer'];
    if (protectedRoles.includes(role.name)) {
      return NextResponse.json({ error: 'Les rôles par défaut ne peuvent pas être supprimés' }, { status: 400 });
    }

    // Ne pas supprimer si des utilisateurs utilisent ce rôle
    if (role._count.users > 0) {
      return NextResponse.json({
        error: `Ce rôle est utilisé par ${role._count.users} utilisateur(s). Réassignez-les d'abord.`
      }, { status: 400 });
    }

    await prisma.role.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
