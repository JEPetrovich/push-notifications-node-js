import { Router } from 'express';
import * as controller from '@src/controllers/notifications-controller.js';

const router = Router();

router.post('/send', controller.sendNotification);

router.put('/register/user/:guId/device/:token', controller.registerUserDevice);

router.put(
  '/unregister/user/:guId/device/:token',
  controller.unregisterUserDevice
);

export default router;
