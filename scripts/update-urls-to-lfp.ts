import prisma from '../lib/prisma';

const OLD_BASE = 'https://oh7qghmltywp4luq.public.blob.vercel-storage.com';
const NEW_BASE = 'https://oh7qghmltywp4luq.public.blob.vercel-storage.com/lfp';

function migrateUrl(url: string): string {
  if (!url) return url;
  // Éviter de doubler le préfixe lfp/
  if (url.startsWith(`${OLD_BASE}/lfp/`)) return url;
  if (url.startsWith(`${OLD_BASE}/`)) {
    const path = url.replace(`${OLD_BASE}/`, '');
    return `${NEW_BASE}/${path}`;
  }
  return url;
}

async function updateUrls() {
  console.log('=== Mise à jour des URLs en DB ===\n');

  let total = 0;

  // Members
  const members = await prisma.member.findMany({ select: { id: true, photo: true } });
  for (const m of members) {
    if (!m.photo) continue;
    const newUrl = migrateUrl(m.photo);
    if (newUrl !== m.photo) {
      await prisma.member.update({ where: { id: m.id }, data: { photo: newUrl } });
      console.log(`Member ${m.id}: ${m.photo.split('/').pop()} → lfp/...`);
      total++;
    }
  }

  // Cars
  const cars = await prisma.car.findMany({ select: { id: true, photos: true } });
  for (const car of cars) {
    const newPhotos = car.photos.map(migrateUrl);
    if (JSON.stringify(newPhotos) !== JSON.stringify(car.photos)) {
      await prisma.car.update({ where: { id: car.id }, data: { photos: newPhotos } });
      console.log(`Car ${car.id}: ${car.photos.length} photos migrées`);
      total++;
    }
  }

  // Events
  const events = await prisma.event.findMany({ select: { id: true, photo: true } });
  for (const ev of events) {
    if (!ev.photo) continue;
    const newUrl = migrateUrl(ev.photo);
    if (newUrl !== ev.photo) {
      await prisma.event.update({ where: { id: ev.id }, data: { photo: newUrl } });
      console.log(`Event ${ev.id}: photo migrée`);
      total++;
    }
  }

  console.log(`\n✓ ${total} enregistrements mis à jour`);
  await prisma.$disconnect();
}

updateUrls().catch(console.error);
