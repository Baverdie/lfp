import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// POST - Vérifier le token et définir le mot de passe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Les mots de passe ne correspondent pas' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
    }

    // Trouver l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        passwordSetupToken: token,
        passwordSetupExpires: {
          gt: new Date(), // Token non expiré
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        error: 'Lien invalide ou expiré. Demandez un nouveau lien à un administrateur.'
      }, { status: 400 });
    }

    // Hasher le mot de passe et mettre à jour l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordSetupToken: null,
        passwordSetupExpires: null,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mot de passe défini avec succès. Vous pouvez maintenant vous connecter.',
    });
  } catch (error) {
    console.error('Error setting up password:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET - Vérifier si le token est valide
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordSetupToken: token,
        passwordSetupExpires: {
          gt: new Date(),
        },
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        valid: false,
        error: 'Lien invalide ou expiré',
      });
    }

    return NextResponse.json({
      valid: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
