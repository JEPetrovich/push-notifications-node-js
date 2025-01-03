import path from 'node:path';

/**
 * Returns full path from "filePath"
 *
 * @param {string} filePath - File path from src folder
 * @returns {string} - Full path
 */
export function getFullPath(filePath: string): string {
  const __dirname: string = import.meta.dirname; // C:\\...\\YOUR_PROJECT_FOLDER\\src
  const fullPath: string = path.join(__dirname, filePath);
  return fullPath;
}
