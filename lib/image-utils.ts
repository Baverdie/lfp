/**
 * Optimise les URLs d'images Cloudinary avec des transformations automatiques
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  } = {}
): string {
  // Si ce n'est pas une URL Cloudinary, retourner telle quelle
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options;

  // Construire les transformations
  const transformations: string[] = [];

  if (format) {
    transformations.push(`f_${format}`);
  }

  if (quality) {
    transformations.push(`q_${quality}`);
  }

  if (width) {
    transformations.push(`w_${width}`);
  }

  if (height) {
    transformations.push(`h_${height}`);
  }

  if (transformations.length === 0) {
    return url;
  }

  const transformStr = transformations.join(',');

  // Insérer les transformations dans l'URL Cloudinary
  // Format: https://res.cloudinary.com/CLOUD_NAME/image/upload/TRANSFORMATIONS/PATH
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  // Vérifier s'il y a déjà des transformations
  if (afterUpload.startsWith('f_') || afterUpload.startsWith('q_') || afterUpload.startsWith('w_')) {
    // Des transformations existent déjà, on les remplace
    const pathIndex = afterUpload.indexOf('/v');
    if (pathIndex !== -1) {
      return `${beforeUpload}${transformStr}${afterUpload.substring(pathIndex)}`;
    }
  }

  return `${beforeUpload}${transformStr}/${afterUpload}`;
}

/**
 * Génère un srcSet pour les images responsives
 */
export function generateSrcSet(
  url: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return '';
  }

  return widths
    .map((w) => `${optimizeCloudinaryUrl(url, { width: w })} ${w}w`)
    .join(', ');
}
