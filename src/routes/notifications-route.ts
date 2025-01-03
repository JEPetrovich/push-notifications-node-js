import { Router } from 'express';
import * as controller from '@controllers/notifications-controller.js';

const router = Router();

router.post('/send', controller.sendNotification);

router.post('/send-no-deps', controller.sendNotificationNoDeps);

router.put('/register/user/:guId/device/:token', controller.registerUserDevice);

router.put(
  '/unregister/user/:guId/device/:token',
  controller.unregisterUserDevice
);

export default router;
