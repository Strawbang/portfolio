import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Types
interface OptimizationResult {
  file: string;
  originalSize: number;
  webpSize: number;
  avifSize: number;
  webpSavings: string;
  avifSavings: string;
}

interface ImageMetadata {
  width?: number;
  height?: number;
}

// Obtenir le chemin du répertoire actuel (équivalent à __dirname en CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const sourceDir = path.join(__dirname, 'public', 'assets');
const targetDir = path.join(__dirname, 'public', 'assets', 'optimized');
const imagesToOptimize: string[] = [
  'fokal-studio.png',
  'maformationmedicale.png',
  'systran.png',
  'portrait.png',
  'metro-france.png'
];

// Créer le répertoire cible s'il n'existe pas
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Fonction pour optimiser une image
async function optimizeImage(filename: string): Promise<OptimizationResult | null> {
  const inputPath = path.join(sourceDir, filename);
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(inputPath)) {
    console.error(`Le fichier ${inputPath} n'existe pas.`);
    return null;
  }
  
  const fileExt = path.extname(filename);
  const baseName = path.basename(filename, fileExt);
  const outputPathWebP = path.join(targetDir, `${baseName}.webp`);
  const outputPathAvif = path.join(targetDir, `${baseName}.avif`);
  
  try {
    // Obtenir les dimensions de l'image
    const metadata: ImageMetadata = await sharp(inputPath).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error(`Impossible de lire les dimensions de l'image ${filename}`);
    }
    
    console.log(`Optimizing ${filename} (${metadata.width}x${metadata.height})`);
    
    // Déterminer la largeur maximale appropriée (1200px est généralement suffisant pour le web)
    const targetWidth = Math.min(metadata.width, 1200);
    const ratio = targetWidth / metadata.width;
    const targetHeight = Math.round(metadata.height * ratio);
    
    // Convertir en WebP
    await sharp(inputPath)
      .resize(targetWidth, targetHeight)
      .webp({ quality: 80 })
      .toFile(outputPathWebP);
      
    // Convertir en AVIF (meilleure compression mais support moins large)
    await sharp(inputPath)
      .resize(targetWidth, targetHeight)
      .avif({ quality: 65 })
      .toFile(outputPathAvif);
      
    // Calculer les économies de taille
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPathWebP).size;
    const avifSize = fs.statSync(outputPathAvif).size;
    
    const webpSavings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
    const avifSavings = ((originalSize - avifSize) / originalSize * 100).toFixed(2);
    
    console.log(`Original: ${(originalSize / 1024).toFixed(2)} KiB`);
    console.log(`WebP: ${(webpSize / 1024).toFixed(2)} KiB (${webpSavings}% savings)`);
    console.log(`AVIF: ${(avifSize / 1024).toFixed(2)} KiB (${avifSavings}% savings)`);
    console.log('-------------------');
    
    return {
      file: filename,
      originalSize,
      webpSize,
      avifSize,
      webpSavings,
      avifSavings
    };
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return null;
  }
}

// Traiter toutes les images
async function processAllImages(): Promise<void> {
  console.log('Starting image optimization...');
  
  const results: OptimizationResult[] = [];
  for (const image of imagesToOptimize) {
    const result = await optimizeImage(image);
    if (result) results.push(result);
  }
  
  // Afficher un résumé
  console.log('\nOptimization Summary:');
  console.log('====================');
  
  let totalOriginal = 0;
  let totalWebP = 0;
  let totalAvif = 0;
  
  results.forEach(result => {
    totalOriginal += result.originalSize;
    totalWebP += result.webpSize;
    totalAvif += result.avifSize;
  });
  
  const totalWebPSavings = ((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(2);
  const totalAvifSavings = ((totalOriginal - totalAvif) / totalOriginal * 100).toFixed(2);
  
  console.log(`Total Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`Total WebP: ${(totalWebP / 1024 / 1024).toFixed(2)} MiB (${totalWebPSavings}% savings)`);
  console.log(`Total AVIF: ${(totalAvif / 1024 / 1024).toFixed(2)} MiB (${totalAvifSavings}% savings)`);
  
  console.log('\nOptimized images are saved in the public/assets/optimized directory.');
  console.log('You can now update your HTML/Astro files to use these optimized images.');
}

// Exécuter le script
processAllImages().catch(console.error);
