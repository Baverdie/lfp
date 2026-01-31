import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, logAction } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import prisma from '@/lib/prisma';

// GET - Détails d'une voiture
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.CARS_VIEW);
  if (error) return error;

  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Voiture non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour une voiture
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.CARS_EDIT);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { model, year, photos, containPhotos, engine, power, modifications, story, memberId, order, isActive } = body;

    const car = await prisma.car.update({
      where: { id },
      data: {
        ...(model && { model }),
        ...(year && { year }),
        ...(photos && { photos }),
        ...(containPhotos !== undefined && { containPhotos }),
        ...(engine !== undefined && { engine }),
        ...(power !== undefined && { power }),
        ...(modifications !== undefined && { modifications }),
        ...(story !== undefined && { story }),
        ...(memberId && { memberId }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await logAction(session!.user.id, 'UPDATE', 'CAR', id, body, request);

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une voiture (suppression définitive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.CARS_DELETE);
  if (error) return error;

  try {
    const { id } = await params;

    // Récupérer les infos avant suppression pour le log
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return NextResponse.json({ error: 'Voiture non trouvée' }, { status: 404 });
    }

    // Suppression définitive
    await prisma.car.delete({ where: { id } });

    await logAction(session!.user.id, 'DELETE', 'CAR', id, { model: car.model }, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
