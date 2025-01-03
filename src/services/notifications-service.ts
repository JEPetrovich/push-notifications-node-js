import jwt from 'jsonwebtoken';
import axios from 'axios';
import * as dataConnection from '@data/connection.js';
import * as fm from '@configurations/file-manager/file-manager-configuration.js';

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

async function getFirebaseAccessToken(): Promise<string> {
  const data = await fm.getFileData({
    filePath: './configurations/firebase/service-account.json',
  });

  if (!data) throw new Error('Service account data not found.');

  const serviceAccount: ServiceAccount = JSON.parse(data);

  const iat = Math.floor(Date.now() / 1000); // Current time
  const exp = iat + 3600; //  Expiration in 1 hour
  const privateKey = serviceAccount.private_key;
  const clientEmail = serviceAccount.client_email;

  const jwtToken = jwt.sign(
    {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/firebase.messaging', // Necessary scope for FCM.
      aud: 'https://oauth2.googleapis.com/token', // Google auth endpoint
      iat,
      exp,
    },
    privateKey,
    { algorithm: 'RS256' }
  );

  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const accessToken: string = response.data.access_token;

  return accessToken;
}

/**
 * Send notification to device through fcm (firebase cloud messaging) without deps
 *
 * @param {FirebaseNotification} firebaseNotification - List of registered devices of users
 */
export async function sendNotification(
  firebaseNotification: FirebaseNotification
) {
  const PROJECT_ID: string = process.env.PROJECT_ID || 'unknown';
  const url: string = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

  const firebaseAccessToken: string = await getFirebaseAccessToken();

  const data = {
    message: firebaseNotification,
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${firebaseAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response;
}
