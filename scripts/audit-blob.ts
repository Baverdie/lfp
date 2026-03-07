import { list } from '@vercel/blob';
import prisma from '../lib/prisma';

async function auditBlob() {
  console.log('=== Audit Vercel Blob ===\n');

  // 1. Lister tous les blobs
  let allBlobs: any[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs = allBlobs.concat(result.blobs);
    cursor = result.cursor;
  } while (cursor);

  const totalSize = allBlobs.reduce((sum, b) => sum + b.size, 0);
  console.log(`Total blobs: ${allBlobs.length}`);
  console.log(`Taille totale: ${(totalSize / 1024 / 1024).toFixed(1)} MB\n`);

  // 2. Récupérer toutes les URLs utilisées dans la DB
  const [members, cars, events] = await Promise.all([
    prisma.member.findMany({ select: { photo: true } }),
    prisma.car.findMany({ select: { photos: true } }),
    prisma.event.findMany({ select: { photo: true } }),
  ]);

  const usedUrls = new Set<string>();
  members.forEach(m => { if (m.photo) usedUrls.add(m.photo); });
  cars.forEach(c => c.photos.forEach(p => usedUrls.add(p)));
  events.forEach(e => { if (e.photo) usedUrls.add(e.photo); });

  console.log(`URLs utilisées en DB: ${usedUrls.size}\n`);

  // 3. Comparer
  const orphaned = allBlobs.filter(b => !usedUrls.has(b.url));
  const used = allBlobs.filter(b => usedUrls.has(b.url));

  const orphanedSize = orphaned.reduce((sum, b) => sum + b.size, 0);
  const usedSize = used.reduce((sum, b) => sum + b.size, 0);

  console.log(`=== Utilisées ===`);
  console.log(`Count: ${used.length} | Taille: ${(usedSize / 1024 / 1024).toFixed(1)} MB`);

  console.log(`\n=== Orphelines (non référencées en DB) ===`);
  console.log(`Count: ${orphaned.length} | Taille: ${(orphanedSize / 1024 / 1024).toFixed(1)} MB`);

  if (orphaned.length > 0) {
    console.log('\nTop 10 plus grosses orphelines:');
    orphaned
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach(b => {
        console.log(`  ${(b.size / 1024 / 1024).toFixed(2)} MB - ${b.pathname}`);
      });
  }

  console.log(`\n=== Top 10 plus grosses images utilisées ===`);
  used
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(b => {
      console.log(`  ${(b.size / 1024 / 1024).toFixed(2)} MB - ${b.pathname}`);
    });

  await prisma.$disconnect();
}

auditBlob().catch(console.error);
