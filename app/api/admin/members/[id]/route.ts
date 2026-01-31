import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, logAction } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import prisma from '@/lib/prisma';

// GET - Détails d'un membre
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.MEMBERS_VIEW);
  if (error) return error;

  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({
      where: { id },
      include: { cars: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour un membre
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.MEMBERS_EDIT);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, instagram, photo, bio, order, isActive } = body;

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(instagram && { instagram }),
        ...(photo && { photo }),
        ...(bio !== undefined && { bio }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await logAction(session!.user.id, 'UPDATE', 'MEMBER', id, body, request);

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un membre (soft ou hard delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.MEMBERS_DELETE);
  if (error) return error;

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      // Hard delete - suppression définitive
      const member = await prisma.member.findUnique({ where: { id } });
      if (!member) {
        return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
      }

      // Supprimer les voitures associées d'abord
      await prisma.car.deleteMany({ where: { memberId: id } });
      // Supprimer le membre
      await prisma.member.delete({ where: { id } });

      await logAction(session!.user.id, 'DELETE', 'MEMBER', id, { name: member.name, permanent: true }, request);
    } else {
      // Soft delete - suspension
      const member = await prisma.member.update({
        where: { id },
        data: { isActive: false },
      });

      await logAction(session!.user.id, 'SUSPEND', 'MEMBER', id, { name: member.name }, request);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
