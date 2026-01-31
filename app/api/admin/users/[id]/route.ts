import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkAuth, logAction } from '@/lib/api-utils';
import { PERMISSIONS } from '@/lib/permissions';
import { sendPasswordSetupEmail, sendPasswordResetEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

// GET - Détails d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.USERS_VIEW);
  if (error) return error;

  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        password: true,
        memberId: true,
        member: {
          select: { id: true, name: true, photo: true },
        },
        role: {
          select: { id: true, name: true, permissions: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...user,
        password: undefined,
        isPasswordSet: !!user.password,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour un utilisateur (sans le mot de passe)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.USERS_EDIT);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, roleId, memberId, isActive, resendInvite, resetPassword } = body;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Si demande de renvoi d'invitation
    if (resendInvite) {
      // Vérifier que le compte n'a pas encore de mot de passe
      if (existingUser.password) {
        return NextResponse.json({
          error: 'Ce compte est déjà activé, impossible de renvoyer l\'invitation'
        }, { status: 400 });
      }

      // Générer un nouveau token
      const passwordSetupToken = crypto.randomBytes(32).toString('hex');
      const passwordSetupExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id },
        data: { passwordSetupToken, passwordSetupExpires },
      });

      const emailResult = await sendPasswordSetupEmail(
        existingUser.email,
        existingUser.name,
        passwordSetupToken
      );

      return NextResponse.json({
        success: true,
        emailSent: emailResult.success,
        message: emailResult.success
          ? 'Email d\'invitation renvoyé'
          : 'Erreur lors de l\'envoi de l\'email',
      });
    }

    // Si demande de réinitialisation de mot de passe
    if (resetPassword) {
      // Vérifier que le compte a déjà un mot de passe
      if (!existingUser.password) {
        return NextResponse.json({
          error: 'Ce compte n\'est pas encore activé'
        }, { status: 400 });
      }

      // Générer un token de réinitialisation (expire dans 1 heure)
      const passwordSetupToken = crypto.randomBytes(32).toString('hex');
      const passwordSetupExpires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id },
        data: { passwordSetupToken, passwordSetupExpires },
      });

      const emailResult = await sendPasswordResetEmail(
        existingUser.email,
        existingUser.name,
        passwordSetupToken
      );

      await logAction(session!.user.id, 'UPDATE', 'USER', id, { action: 'password_reset', email: existingUser.email }, request);

      return NextResponse.json({
        success: true,
        emailSent: emailResult.success,
        message: emailResult.success
          ? 'Email de réinitialisation envoyé'
          : 'Erreur lors de l\'envoi de l\'email',
      });
    }

    // Si email change, vérifier qu'il n'est pas déjà utilisé
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
      }
    }

    // Si memberId fourni, vérifier que le membre existe
    if (memberId) {
      const member = await prisma.member.findUnique({ where: { id: memberId } });
      if (!member) {
        return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
      }
    }

    // Préparer les données de mise à jour (PAS de mot de passe ici)
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (roleId) updateData.roleId = roleId;
    if (memberId !== undefined) updateData.memberId = memberId || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        memberId: true,
        member: {
          select: { id: true, name: true, photo: true },
        },
        role: {
          select: { id: true, name: true },
        },
      },
    });

    await logAction(session!.user.id, 'UPDATE', 'USER', id, { name, email }, request);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un utilisateur (suppression définitive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await checkAuth(PERMISSIONS.USERS_DELETE);
  if (error) return error;

  try {
    const { id } = await params;

    // Ne pas permettre de se supprimer soi-même
    if (id === session!.user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous supprimer vous-même' }, { status: 400 });
    }

    // Récupérer les infos avant suppression pour le log
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Suppression définitive
    await prisma.user.delete({ where: { id } });

    await logAction(session!.user.id, 'DELETE', 'USER', id, { email: user.email }, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
