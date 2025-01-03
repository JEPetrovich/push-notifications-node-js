import * as utilities from '@src/utilities.js';
import fs from 'node:fs/promises';

export async function getFileData({
  filePath,
}: Pick<FileDataProps, 'filePath'>) {
  const fullPath: string = utilities.getFullPath(filePath);
  try {
    const data = await fs.readFile(fullPath, {
      encoding: 'utf-8',
    });
    return data;
  } catch (error) {
    const fileName: string = filePath.split('/').pop() || 'file-name';
    console.group(`Error reading "${fileName}":`);
    console.error(error);
    console.groupEnd();
    return null;
  }
}

export async function setFileData({
  data,
  filePath,
}: Pick<FileDataProps, 'data' | 'filePath'>) {
  const fullPath: string = utilities.getFullPath(filePath);
  await fs.writeFile(fullPath, data);
}
