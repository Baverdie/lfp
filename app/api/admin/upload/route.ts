import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api-utils';
import { put, del } from '@vercel/blob';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const { error } = await checkAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { file, folder = 'uploads' } = body;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    if (!file.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    const matches = file.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Format de fichier invalide' }, { status: 400 });
    }

    const [, extension, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const filename = `${timestamp}-${uniqueId}.${extension === 'jpeg' ? 'jpg' : extension}`;

    const folderMap: Record<string, string> = {
      'lfp/crew': 'lfp/crew',
      'lfp/cars': 'lfp/cars',
      'lfp/events': 'lfp/events',
      'crew': 'lfp/crew',
      'cars': 'lfp/cars',
      'events': 'lfp/events',
    };
    const targetFolder = folderMap[folder] || 'lfp/uploads';

    const blob = await put(`${targetFolder}/${filename}`, buffer, {
      access: 'public',
      contentType: `image/${extension}`,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await checkAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL de l\'image requise' }, { status: 400 });
    }

    if (imageUrl.includes('.blob.vercel-storage.com') || imageUrl.includes('.public.blob.vercel-storage.com')) {
      await del(imageUrl);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
