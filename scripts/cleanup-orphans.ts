import { list, del } from '@vercel/blob';
import prisma from '../lib/prisma';

async function cleanupOrphans() {
  console.log('=== Suppression des blobs orphelins ===\n');

  // Lister tous les blobs
  let allBlobs: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs = allBlobs.concat(result.blobs);
    cursor = result.cursor;
  } while (cursor);

  // URLs utilisées en DB
  const [members, cars, events] = await Promise.all([
    prisma.member.findMany({ select: { photo: true } }),
    prisma.car.findMany({ select: { photos: true } }),
    prisma.event.findMany({ select: { photo: true } }),
  ]);

  const usedUrls = new Set<string>();
  members.forEach(m => { if (m.photo) usedUrls.add(m.photo); });
  cars.forEach(c => c.photos.forEach(p => usedUrls.add(p)));
  events.forEach(e => { if (e.photo) usedUrls.add(e.photo); });

  const orphaned = allBlobs.filter(b => !usedUrls.has(b.url));

  if (orphaned.length === 0) {
    console.log('Aucun blob orphelin trouvé.');
    await prisma.$disconnect();
    return;
  }

  console.log(`${orphaned.length} orphelins à supprimer :`);
  orphaned.forEach(b => console.log(`  - ${b.pathname} (${(b.size / 1024 / 1024).toFixed(2)} MB)`));

  const totalFreed = orphaned.reduce((sum, b) => sum + b.size, 0);

  // Supprimer
  const urls = orphaned.map(b => b.url);
  await del(urls);

  console.log(`\n✓ Supprimés : ${orphaned.length} fichiers`);
  console.log(`✓ Libéré : ${(totalFreed / 1024 / 1024).toFixed(1)} MB`);

  await prisma.$disconnect();
}

cleanupOrphans().catch(console.error);
