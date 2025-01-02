import 'module-alias/register.js';
import express from 'express';
import notificationsRoute from '@src/routes/notifications-route.js';
import print from '@src/configurations/print-configuration.js';

process.loadEnvFile();

const app = express();

app.use([express.json()]);

app.use('/api/notifications', notificationsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  print({ format: 'green', message: `Server is running on port ${PORT}.` });
});
