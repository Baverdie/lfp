import { list, put, del } from '@vercel/blob';
import prisma from '../lib/prisma';

const BASE_URL = 'https://oh7qghmltywp4luq.public.blob.vercel-storage.com';

// Orphelins connus à supprimer sans déplacer
const ORPHANS_TO_DELETE = [
  `${BASE_URL}/crew/1769945963074-a19c7a20dc8715d0.jpg`,
  `${BASE_URL}/crew/1769946086046-8d8e1638dcaebc86.jpg`,
  `${BASE_URL}/crew/1769973379836-65c849a00594c6e6.jpg`,
  `${BASE_URL}/crew/1770835125502-95f97dabdc7512ab.jpg`,
];

async function moveToLfpFolder() {
  console.log('=== Migration vers lfp/ ===\n');

  // 1. Lister tous les blobs actuels
  let allBlobs: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs = allBlobs.concat(result.blobs);
    cursor = result.cursor;
  } while (cursor);

  // Exclure les orphelins et les fichiers déjà dans lfp/
  const toMove = allBlobs.filter(b =>
    !b.pathname.startsWith('lfp/') &&
    !ORPHANS_TO_DELETE.includes(b.url)
  );

  console.log(`Fichiers à déplacer : ${toMove.length}`);
  console.log(`Orphelins à supprimer : ${ORPHANS_TO_DELETE.length}\n`);

  // 2. Supprimer les orphelins d'abord
  await del(ORPHANS_TO_DELETE);
  console.log(`✓ ${ORPHANS_TO_DELETE.length} orphelins supprimés\n`);

  // 3. Déplacer chaque blob vers lfp/<pathname>
  const urlMapping: Record<string, string> = {}; // ancienne URL → nouvelle URL

  for (let i = 0; i < toMove.length; i++) {
    const blob = toMove[i];
    const newPathname = `lfp/${blob.pathname}`;

    process.stdout.write(`[${i + 1}/${toMove.length}] ${blob.pathname} → ${newPathname} ... `);

    try {
      // Télécharger l'ancien fichier
      const res = await fetch(blob.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());

      // Uploader au nouveau chemin
      const result = await put(newPathname, buffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType: res.headers.get('content-type') || 'image/jpeg',
        allowOverwrite: true,
      });

      urlMapping[blob.url] = result.url;
      console.log('✓');
    } catch (err) {
      console.log(`✗ ERREUR: ${err}`);
    }
  }

  // 4. Mettre à jour la DB
  console.log('\n=== Mise à jour de la base de données ===');

  const members = await prisma.member.findMany({ select: { id: true, photo: true } });
  let dbUpdates = 0;

  for (const member of members) {
    if (member.photo && urlMapping[member.photo]) {
      await prisma.member.update({
        where: { id: member.id },
        data: { photo: urlMapping[member.photo] },
      });
      dbUpdates++;
    }
  }

  const cars = await prisma.car.findMany({ select: { id: true, photos: true } });
  for (const car of cars) {
    const newPhotos = car.photos.map(p => urlMapping[p] || p);
    if (JSON.stringify(newPhotos) !== JSON.stringify(car.photos)) {
      await prisma.car.update({ where: { id: car.id }, data: { photos: newPhotos } });
      dbUpdates++;
    }
  }

  const events = await prisma.event.findMany({ select: { id: true, photo: true } });
  for (const event of events) {
    if (event.photo && urlMapping[event.photo]) {
      await prisma.event.update({
        where: { id: event.id },
        data: { photo: urlMapping[event.photo] },
      });
      dbUpdates++;
    }
  }

  console.log(`✓ ${dbUpdates} enregistrements mis à jour en DB\n`);

  // 5. Afficher le mapping pour mettre à jour le code manuellement
  console.log('=== URLs hardcodées à mettre à jour dans le code ===');
  const hardcoded = [
    'logo-lfp.jpg',
    'crew/nathan-b.jpg',
    'group/group-5.jpg',
  ];
  for (const path of hardcoded) {
    const oldUrl = `${BASE_URL}/${path}`;
    const newUrl = urlMapping[oldUrl];
    if (newUrl) console.log(`${oldUrl}\n→ ${newUrl}\n`);
  }

  // 6. Supprimer les anciens blobs
  console.log('=== Suppression des anciens fichiers ===');
  const movedOldUrls = Object.keys(urlMapping);
  if (movedOldUrls.length > 0) {
    await del(movedOldUrls);
    console.log(`✓ ${movedOldUrls.length} anciens fichiers supprimés`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Migration terminée !');
}

moveToLfpFolder().catch(console.error);
