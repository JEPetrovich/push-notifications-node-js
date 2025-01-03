import { Request, Response } from 'express-serve-static-core';
import firebaseAdmin from '@configurations/firebase/admin-firebase-configuration.js';
import * as service from '@services/notifications-service.js';

export async function sendNotification(req: Request, res: Response) {
  const { token, notification } = req.body as FirebaseNotification;
  const data = { token, notification };
  try {
    const response = await firebaseAdmin.messaging().send(data);
    res.status(200).send({
      message: 'Notification sent successfully!',
      data: response,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error sending notification.',
      error,
    });
  }
}

export async function registerUserDevice(req: Request, res: Response) {
  const { guId: userGuId, token } = req.params as RegisterUserDevice;
  try {
    await service.registerUserDevice({ userGuId, token });
    res.status(200).send({
      message: 'User device successfully registered!',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error registering user device.',
      error,
    });
  }
}

export async function unregisterUserDevice(req: Request, res: Response) {
  const { guId: userGuId, token } = req.params as RegisterUserDevice;
  try {
    await service.unregisterUserDevice({ userGuId, token });
    res.status(200).send({
      message: 'User device successfully unregistered!',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error unregistering user device.',
      error,
    });
  }
}
