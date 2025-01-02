<h2>Ejecución de API Rest</h2>

<p>Para levantar el servicio, se ejecutaran los siguientes comandos con la terminal ubicada dentro de la carpeta del proyecto:</p>

```npm
    npm install
    npm run build
    npm run start
```

<p>Se debe tener en cuenta que por defecto se ejecuta en localhost en el puerto 8090 (el puerto se modifica en archivo .env).</p>

<h3>Acerca de la prueba de endpoints</h3>

<p>Para crear notificaciones, se enviará por el cuerpo un json con el siguiente esquema:</p>

```typescript
type FirebaseNotification = {
  notification: {
    /** Titulo de la notificación */
    title: string;
    /** Cuerpo de la notificación */
    body: string;
  };
  /** Token del dispositivo */
  token: string;
};
```

<h2>Endpoints</h2>

<p><b>api/notifications/send</b> | Envia la notificación al dispositivo correspondiente:</p>

```typescript
router.post('/send', sendNotification);

async function sendNotification(req: Request, res: Response) {
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
```

<p><b>api/notifications/register/user/:guId/device/:token</b> | Guarda guId del usuario (en archivo /src/data/user-devices.json) y asocia el token del dispositivo al mismo:</p>

```typescript
router.put('/register/user/:guId/device/:token', controller.registerUserDevice);

async function registerUserDevice(req: Request, res: Response) {
  const { guId: userGuId, token } = req.params as RegisterUserDevice;
  await service.registerUserDevice({ userGuId, token });
  try {
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
```

<p><b>api/notifications/unregister/user/:guId/device/:token</b> | Quita la asociación entre el token del dispositivo y el usuario:</p>

```typescript
router.put(
  '/unregister/user/:guId/device/:token',
  controller.registerUserDevice
);

async function unregisterUserDevice(req: Request, res: Response) {
  const { guId: userGuId, token } = req.params as RegisterUserDevice;
  await service.unregisterUserDevice({ userGuId, token });
  try {
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
```
