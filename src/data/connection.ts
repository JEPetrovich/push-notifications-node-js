import print from '@src/configurations/print-configuration.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const __dirname: string = import.meta.dirname;
const filePath: string = path.join(__dirname, './user-devices.json');

export async function getUserDevices() {
  try {
    const data = await fs.readFile(filePath, {
      encoding: 'utf-8',
    });
    const userDevices: UserDevice[] = JSON.parse(data);
    return userDevices;
  } catch (error) {
    console.group('Error reading "user-devices.json":');
    console.error(error);
    console.groupEnd();
    return [];
  }
}

export async function updateUserDevices(newUserDevices: UserDevice[]) {
  try {
    const data: string = JSON.stringify(newUserDevices);
    await fs.writeFile(filePath, data);
    print({ format: 'green', message: 'User devices updated successfully!' });
  } catch (error) {
    console.group('Error updating "user-devices.json":');
    console.error(error);
    console.groupEnd();
  }
}
