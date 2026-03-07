import { list, put, del } from '@vercel/blob';
import sharp from 'sharp';
import prisma from '../lib/prisma';

// Paramètres de compression selon le type de fichier
function getCompressionSettings(pathname: string) {
  if (pathname.includes('group/')) {
    // Photos de groupe : paysage, max 1920px
    return { width: 1920, height: 1920, quality: 82, fit: 'inside' as const };
  }
  if (pathname.includes('9-16') || pathname.includes('portrait')) {
    // Portraits voitures : max 1200px de large
    return { width: 1200, height: 2400, quality: 82, fit: 'inside' as const };
  }
  if (pathname.includes('16-9') || pathname.includes('landscape')) {
    // Paysage voitures : max 1920px
    return { width: 1920, height: 1080, quality: 82, fit: 'inside' as const };
  }
  if (pathname.includes('crew/') || pathname.includes('members/')) {
    // Photos de membres : max 800px
    return { width: 800, height: 800, quality: 85, fit: 'inside' as const };
  }
  // Défaut
  return { width: 1920, height: 1920, quality: 82, fit: 'inside' as const };
}

async function compressImages() {
  console.log('=== Compression et re-upload des images ===\n');

  // Lister tous les blobs
  let allBlobs: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs = allBlobs.concat(result.blobs);
    cursor = result.cursor;
  } while (cursor);

  // Exclure les petites images déjà compressées (< 500 KB)
  const toCompress = allBlobs.filter(b => b.size > 500 * 1024);

  const totalBefore = toCompress.reduce((sum, b) => sum + b.size, 0);
  console.log(`Images à compresser : ${toCompress.length} (${(totalBefore / 1024 / 1024).toFixed(1)} MB)\n`);

  let totalAfter = 0;
  let errors = 0;

  for (let i = 0; i < toCompress.length; i++) {
    const blob = toCompress[i];
    const { width, height, quality, fit } = getCompressionSettings(blob.pathname);

    process.stdout.write(`[${i + 1}/${toCompress.length}] ${blob.pathname} (${(blob.size / 1024 / 1024).toFixed(2)} MB) → `);

    try {
      // Télécharger l'image
      const res = await fetch(blob.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());

      // Compresser avec sharp
      const compressed = await sharp(buffer)
        .resize(width, height, { fit, withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      totalAfter += compressed.length;

      const savings = ((1 - compressed.length / blob.size) * 100).toFixed(0);
      process.stdout.write(`${(compressed.length / 1024 / 1024).toFixed(2)} MB (-${savings}%)\n`);

      // Re-uploader au même emplacement (écrase l'ancien)
      await put(blob.pathname, compressed, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'image/jpeg',
        allowOverwrite: true,
      });

    } catch (err) {
      console.error(`ERREUR: ${err}`);
      errors++;
      totalAfter += blob.size; // compter l'original si erreur
    }
  }

  const freed = totalBefore - totalAfter;
  console.log('\n=== Résultats ===');
  console.log(`Avant : ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Après : ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Libéré : ${(freed / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Erreurs : ${errors}`);

  await prisma.$disconnect();
}

compressImages().catch(console.error);
