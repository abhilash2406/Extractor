import sharp from 'sharp';

/**
 * Create a thumbnail from a image
 * @param {Buffer | string} image
 * @returns {Promise<Buffer>}
 */
export async function createImageThumbnail(image) {
  return sharp(image)
    .resize(
      150,
      150,
      { fit: 'cover' },
    )
    .png()
    .toBuffer();
}

/**
 * Get thumbnail key from s3 key
 * @param {string} key - S3 key
 * @returns {string}
 */
export function getThumbKey(key) {
  let parts = key.split('/');
  parts.splice(-1, 0, 'thumb');
  parts = parts.join('/').split('.');
  parts.pop();
  parts = `${parts.join('.')}.png`;

  return parts;
}
