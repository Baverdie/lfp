import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { error } = await checkAuth(PERMISSIONS.LOGS_VIEW);
    if (error) return error;

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.log.count(),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
