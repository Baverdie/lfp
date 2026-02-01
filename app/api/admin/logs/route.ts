import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { error, session } = await checkAuth(PERMISSIONS.LOGS_VIEW);
    if (error) {
      console.log('[LOGS API] Auth check failed');
      return error;
    }

    console.log('[LOGS API] Auth passed for user:', session?.user?.email);

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    console.log('[LOGS API] Fetching logs with limit:', limit, 'page:', page);

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

    console.log('[LOGS API] Found', logs.length, 'logs, total:', total);

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
    console.error('[LOGS API] Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Erreur serveur', details: errorMessage }, { status: 500 });
  }
}
