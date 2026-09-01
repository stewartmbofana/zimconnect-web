import imageCompression from 'browser-image-compression'

const TARGET_SIZE_MB = 0.19 // ~195KB — safely below 200KB
const MAX_WIDTH_OR_HEIGHT = 1200

export interface CompressedImage {
  file: File
  sizeKb: number
  url: string  // Object URL for preview; caller must revoke when done
}

/**
 * Compresses an image file to <200KB WebP format using client-side processing.
 * Converts any image type to WebP during compression.
 */
export async function compressToWebP(input: File): Promise<CompressedImage> {
  const compressed = await imageCompression(input, {
    maxSizeMB: TARGET_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    fileType: 'image/webp',
    useWebWorker: true,
  })

  const sizeKb = Math.round(compressed.size / 1024)
  const url = URL.createObjectURL(compressed)

  return { file: compressed, sizeKb, url }
}

/**
 * Compresses multiple images, returning results in the same order.
 */
export async function compressImages(files: File[]): Promise<CompressedImage[]> {
  return Promise.all(files.map(compressToWebP))
}
