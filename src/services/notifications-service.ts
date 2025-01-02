import * as dataConnection from '@data/connection.js';

/**
 * Check if device token is already registered for other user
 *
 * @param {UserDevice[]} userDevices - List of registered devices of users
 * @param {string} guId - User guid
 * @param {string} token - Device token
 * @returns {boolean}
 */
function checkIfDeviceAlreadyRegistered(
  userDevices: UserDevice[],
  guId: string,
  token: string
): UserDevice[] {
  const newUserDevices: UserDevice[] = userDevices.map((userDevice) => {
    if (!userDevice.tokens.includes(token) || userDevice['user-guid'] === guId)
      return userDevice;
    const newTokens: string[] = [...userDevice.tokens].filter(
      (deviceToken) => deviceToken !== token
    );
    userDevice.tokens = newTokens;
    return userDevice;
  });
  return newUserDevices;
}

function getNewRegisteredUserDevice(
  userDevices: UserDevice[],
  userGuId: string,
  token: string
) {
  let newUserDevices: UserDevice[] = checkIfDeviceAlreadyRegistered(
    userDevices,
    userGuId,
    token
  );
  /** User not found */
  if (
    !newUserDevices.some((userDevice) => userDevice['user-guid'] === userGuId)
  )
    return [...newUserDevices, { 'user-guid': userGuId, tokens: [token] }];
  /** User found */
  return newUserDevices.map((userDevice) => {
    /** Isn't the user  */
    if (userDevice['user-guid'] !== userGuId) return userDevice;
    /** User device already registered */
    if (userDevice.tokens.includes(token)) return userDevice;
    /** Register device user */
    const newTokens = [...userDevice.tokens, token];
    userDevice.tokens = newTokens;
    return userDevice;
  });
}

export async function registerUserDevice({ userGuId, token }: UserDeviceProps) {
  const userDevices = await dataConnection.getUserDevices();
  const newUserDevices: UserDevice[] = getNewRegisteredUserDevice(
    userDevices,
    userGuId,
    token
  );
  await dataConnection.updateUserDevices(newUserDevices);
}

function getNewUnregisteredUserDevice(
  userDevices: UserDevice[],
  userGuId: string,
  token: string
) {
  /** User not found */
  if (!userDevices.some((userDevice) => userDevice['user-guid'] === userGuId))
    return userDevices;
  /** User found */
  return userDevices.map((userDevice) => {
    /** Isn't the user  */
    if (userDevice['user-guid'] !== userGuId) return userDevice;
    /** Unregister device user */
    const newTokens = userDevice.tokens.filter(
      (deviceToken) => deviceToken !== token
    );
    userDevice.tokens = newTokens;
    return userDevice;
  });
}

export async function unregisterUserDevice({
  userGuId,
  token,
}: UserDeviceProps) {
  const userDevices = await dataConnection.getUserDevices();
  const newUserDevices: UserDevice[] = getNewUnregisteredUserDevice(
    userDevices,
    userGuId,
    token
  );
  await dataConnection.updateUserDevices(newUserDevices);
}
