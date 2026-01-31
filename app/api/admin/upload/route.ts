import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// POST - Upload une image localement
export async function POST(request: NextRequest) {
  const { error } = await checkAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { file, folder = 'uploads' } = body;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    // Vérifier que c'est une image
    if (!file.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Extraire le type MIME et les données base64
    const matches = file.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Format de fichier invalide' }, { status: 400 });
    }

    const [, extension, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');

    // Générer un nom de fichier unique
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const filename = `${timestamp}-${uniqueId}.${extension === 'jpeg' ? 'jpg' : extension}`;

    // Mapper les dossiers
    const folderMap: Record<string, string> = {
      'lfp/crew': 'crew',
      'lfp/cars': 'cars',
      'lfp/events': 'events',
      'lfp': 'uploads',
    };
    const targetFolder = folderMap[folder] || 'uploads';

    // Créer le dossier si nécessaire
    const uploadDir = path.join(process.cwd(), 'public', 'images', targetFolder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Écrire le fichier
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Retourner l'URL relative
    const url = `/images/${targetFolder}/${filename}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}

// DELETE - Supprimer une image locale
export async function DELETE(request: NextRequest) {
  const { error } = await checkAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL de l\'image requise' }, { status: 400 });
    }

    // Sécurité : s'assurer que le chemin est bien dans /images/
    if (!imageUrl.startsWith('/images/')) {
      return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 });
    }

    // Construire le chemin absolu
    const filePath = path.join(process.cwd(), 'public', imageUrl);

    // Vérifier que le fichier existe et le supprimer
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
