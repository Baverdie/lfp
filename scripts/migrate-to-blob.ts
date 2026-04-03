import 'dotenv/config';
import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

interface MigrationResult {
  oldPath: string;
  newUrl: string;
}

async function getFilesRecursively(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFilesRecursively(fullPath)));
    } else if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function migrateImages() {
  console.log('🚀 Début de la migration des images vers Vercel Blob...\n');

  const files = await getFilesRecursively(IMAGES_DIR);
  console.log(`📁 ${files.length} images trouvées\n`);

  const results: MigrationResult[] = [];
  let success = 0;
  let failed = 0;

  for (const filePath of files) {
    const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
    const blobPath = path.relative(IMAGES_DIR, filePath);

    try {
      const buffer = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase().slice(1);
      const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

      const blob = await put(blobPath, buffer, {
        access: 'public',
        contentType,
      });

      results.push({
        oldPath: `/${relativePath}`,
        newUrl: blob.url,
      });

      success++;
      console.log(`✅ ${blobPath} → ${blob.url}`);
    } catch (error) {
      failed++;
      console.error(`❌ ${blobPath}: ${error}`);
    }
  }

  console.log(`\n📊 Résultat: ${success} réussies, ${failed} échecs`);
  console.log('\n📋 Mapping des URLs (à utiliser pour mettre à jour la BDD):');
  console.log(JSON.stringify(results, null, 2));

  return results;
}

migrateImages().catch(console.error);
