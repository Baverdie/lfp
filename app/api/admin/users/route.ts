import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkAuth, logAction } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import { sendPasswordSetupEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

// GET - Liste des utilisateurs
export async function GET(request: NextRequest) {
  const { error, session } = await checkAuth(PERMISSIONS.USERS_VIEW);
  if (error) return error;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        password: true, // Pour savoir si le compte est activé
        memberId: true,
        member: {
          select: { id: true, name: true, photo: true },
        },
        role: {
          select: { id: true, name: true, permissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Ne pas exposer le password, juste indiquer si le compte est activé
    const usersWithStatus = users.map(user => ({
      ...user,
      password: undefined,
      isPasswordSet: !!user.password,
    }));

    return NextResponse.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un utilisateur (envoie un email pour définir le mot de passe)
export async function POST(request: NextRequest) {
  const { error, session } = await checkAuth(PERMISSIONS.USERS_CREATE);
  if (error) return error;

  try {
    const body = await request.json();
    const { name, email, roleId, memberId } = body;

    if (!name || !email || !roleId) {
      return NextResponse.json({ error: 'Nom, email et rôle requis' }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Vérifier que le rôle existe
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }

    // Si memberId fourni, vérifier que le membre existe
    if (memberId) {
      const member = await prisma.member.findUnique({ where: { id: memberId } });
      if (!member) {
        return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
      }
    }

    // Générer un token pour définir le mot de passe
    const passwordSetupToken = crypto.randomBytes(32).toString('hex');
    const passwordSetupExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    const user = await prisma.user.create({
      data: {
        name,
        email,
        roleId,
        memberId: memberId || null,
        passwordSetupToken,
        passwordSetupExpires,
        // password reste null jusqu'à ce que l'utilisateur le définisse
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        role: {
          select: { id: true, name: true },
        },
        member: {
          select: { id: true, name: true, photo: true },
        },
      },
    });

    // Envoyer l'email d'invitation
    const emailResult = await sendPasswordSetupEmail(email, name, passwordSetupToken);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
    }

    await logAction(session!.user.id, 'CREATE', 'USER', user.id, { name, email }, request);

    return NextResponse.json({
      user,
      emailSent: emailResult.success,
      message: emailResult.success
        ? 'Utilisateur créé, un email a été envoyé'
        : 'Utilisateur créé mais l\'email n\'a pas pu être envoyé',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
