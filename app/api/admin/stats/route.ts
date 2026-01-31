import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import prisma from '@/lib/prisma';

export async function GET() {
  const { error, session } = await checkAuth();
  if (error) return error;

  try {
    const [members, cars, events, users] = await Promise.all([
      prisma.member.count({ where: { isActive: true } }),
      prisma.car.count({ where: { isActive: true } }),
      prisma.event.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({ members, cars, events, users });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
