/**
 * Google Drive URL Normalizer & Validator
 * Converts various Google Drive link formats into direct embeddable image URLs.
 */

// Supported link formats:
// - https://drive.google.com/file/d/FILE_ID/view...
// - https://drive.google.com/open?id=FILE_ID
// - https://drive.google.com/uc?id=FILE_ID
// - https://lh3.googleusercontent.com/d/FILE_ID

export const extractGoogleDriveFileId = (url) => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // Pattern 2: id=FILE_ID (from open?id= or uc?id=)
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  // Pattern 3: googleusercontent.com/d/FILE_ID
  const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
};

export const isGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('googleusercontent.com');
};

/**
 * Normalizes any valid Google Drive image URL to high-speed CDN direct image format.
 * Returns primary direct URL and fallback URL.
 */
export const normalizeGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return '';

  // Security check: Reject javascript: or unsafe URI schemes
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) {
    return '';
  }

  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    // Primary: Google user content CDN (direct image viewing)
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
};

/**
 * Fallback URL in case Google CDN thumbnail hits rate limit or cookie policy
 */
export const getGoogleDriveFallbackUrl = (url) => {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return '';
};
