import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BLOB_BASE_URL = 'https://oh7qghmltywp4luq.public.blob.vercel-storage.com';

function convertToBlob(localPath: string | null): string | null {
  if (!localPath) return null;

  // Si c'est déjà une URL Blob ou externe, ne pas modifier
  if (localPath.startsWith('http')) return localPath;

  // Convertir /images/cars/xxx.jpg → https://blob.../cars/xxx.jpg
  if (localPath.startsWith('/images/')) {
    const relativePath = localPath.replace('/images/', '');
    return `${BLOB_BASE_URL}/${relativePath}`;
  }

  return localPath;
}

async function updateDatabaseUrls() {
  console.log('🔄 Mise à jour des URLs dans la base de données...\n');

  // Mettre à jour les membres (champ: photo)
  const members = await prisma.member.findMany();
  console.log(`👥 ${members.length} membres trouvés`);

  for (const member of members) {
    const newPhoto = convertToBlob(member.photo);
    if (newPhoto && newPhoto !== member.photo) {
      await prisma.member.update({
        where: { id: member.id },
        data: { photo: newPhoto },
      });
      console.log(`  ✅ ${member.name}: ${member.photo} → ${newPhoto}`);
    }
  }

  // Mettre à jour les voitures (champ: photos - array de strings)
  const cars = await prisma.car.findMany();
  console.log(`\n🚗 ${cars.length} voitures trouvées`);

  for (const car of cars) {
    if (car.photos && car.photos.length > 0) {
      const newPhotos = car.photos.map(photo => convertToBlob(photo) || photo);
      const photosChanged = JSON.stringify(newPhotos) !== JSON.stringify(car.photos);

      if (photosChanged) {
        await prisma.car.update({
          where: { id: car.id },
          data: { photos: newPhotos },
        });
        console.log(`  ✅ ${car.model} - ${car.photos.length} photos mises à jour`);
      }
    }
  }

  // Mettre à jour les événements (champ: photo)
  const events = await prisma.event.findMany();
  console.log(`\n📅 ${events.length} événements trouvés`);

  for (const event of events) {
    const newPhoto = convertToBlob(event.photo);
    if (newPhoto !== event.photo) {
      await prisma.event.update({
        where: { id: event.id },
        data: { photo: newPhoto },
      });
      console.log(`  ✅ ${event.title}: ${event.photo} → ${newPhoto}`);
    }
  }

  console.log('\n✅ Migration terminée!');
}

updateDatabaseUrls()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
