import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Assets hardcodés dans le code (pas en DB) qui ont été supprimés
const ASSETS = [
  { localPath: 'public/images/logo-lfp.jpg', blobPath: 'logo-lfp.jpg' },
  { localPath: 'public/images/group/group-5.jpg', blobPath: 'group/group-5.jpg' },
  { localPath: 'public/images/crew/nathan-b.jpg', blobPath: 'crew/nathan-b.jpg' },
];

async function restoreAssets() {
  const base = '/Users/bastienverdier-vaissiere/Documents/Baverdie/Code/Projet Pro/lfp';

  for (const asset of ASSETS) {
    const fullPath = path.join(base, asset.localPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`✗ Fichier local non trouvé : ${asset.localPath}`);
      continue;
    }

    const file = fs.readFileSync(fullPath);
    console.log(`Uploading ${asset.blobPath} (${(file.length / 1024).toFixed(0)} KB)...`);

    const result = await put(asset.blobPath, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'image/jpeg',
      allowOverwrite: true,
    });

    console.log(`✓ ${result.url}`);
  }
}

restoreAssets().catch(console.error);
