import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, logAction } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import prisma from '@/lib/prisma';

// GET - Liste des membres
export async function GET(request: NextRequest) {
  const { error, session } = await checkAuth(PERMISSIONS.MEMBERS_VIEW);
  if (error) return error;

  try {
    const members = await prisma.member.findMany({
      include: {
        cars: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un membre
export async function POST(request: NextRequest) {
  const { error, session } = await checkAuth(PERMISSIONS.MEMBERS_CREATE);
  if (error) return error;

  try {
    const body = await request.json();
    const { name, instagram, photo, bio, order } = body;

    if (!name || !instagram) {
      return NextResponse.json({ error: 'Nom et Instagram requis' }, { status: 400 });
    }

    // Récupérer l'ordre maximum pour ajouter le nouveau membre à la fin
    const lastMember = await prisma.member.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = (lastMember?.order ?? -1) + 1;

    const member = await prisma.member.create({
      data: {
        name,
        instagram,
        photo: photo || '/images/crew/default.jpg',
        bio: bio || '',
        order: order ?? nextOrder,
      },
    });

    await logAction(session!.user.id, 'CREATE', 'MEMBER', member.id, { name }, request);

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
