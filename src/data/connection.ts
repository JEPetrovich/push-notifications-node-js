import print from '@configurations/print-configuration.js';
import * as fm from '@configurations/file-manager/file-manager-configuration.js';

const filePath: string = './data/user-devices.json';

export async function getUserDevices() {
  try {
    const data = await fm.getFileData({ filePath });
    if (data == null) throw new Error('Unknown file path.');
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
    await fm.setFileData({ filePath, data });
    print({ format: 'green', message: 'User devices updated successfully!' });
  } catch (error) {
    console.group('Error updating "user-devices.json":');
    console.error(error);
    console.groupEnd();
  }
}
