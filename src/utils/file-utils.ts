/**
 * Sanitizes a filename by:
 * 1. Removing special characters
 * 2. Converting to lowercase
 * 3. Replacing spaces with hyphens
 * 4. Truncating to a reasonable length
 * 5. Preserving the file extension
 */
export function sanitizeFileName(fileName: string): string {
  // Split the filename and extension
  const parts = fileName.split('.');
  const extension = parts.pop() || '';
  let name = parts.join('.');

  // Sanitize the filename
  name = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 32); // Truncate to 32 characters

  // Return the sanitized filename with extension
  return `${name}.${extension}`;
}