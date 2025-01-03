<h2>Ejecución de API Rest</h2>

<p>Para levantar el servicio, se ejecutaran los siguientes comandos con la terminal ubicada dentro de la carpeta del proyecto:</p>

```npm
    npm install
    npm run build
    npm run start
```

<p>Se debe tener en cuenta que por defecto se ejecuta en localhost en el puerto 8090 (el puerto se modifica en archivo .env).</p>

<h3>Almacenamiento de datos</h3>

<p>El almacenamiento se realiza a través de un archivo ".json" local (no por bdd), ubicado en "src/data/user-devices.json", que contiene una lista de elementos con el siguiente esquema por item:</p>

```typescript
type UserDevice = {
  'user-guid': string;
  tokens: string[] /** Un usuario puede tener varios dispositivos vinculados */;
};
```

<h2>Endpoints</h2>

<p><b>api/notifications/send</b> | Envia la notificación al dispositivo correspondiente.</p>

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

/** Example of body request */

const body: FirebaseNotification = {
 notification: {
    title: 'Example title notification',
    body: 'Example body notification',
  },
  token: 'YOUR_DEVICE_TOKEN';
}
```

<h3>Ruta notificaciones y controladores:</h3>

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

router.post('/send-no-deps', sendNotificationNoDeps);

async function sendNotificationNoDeps(req: Request, res: Response) {
  const { token, notification } = req.body as FirebaseNotification;
  const data = { token, notification };
  try {
    const response = await service.sendNotification(data);
    res.status(200).send({
      message: 'Notification sent successfully!',
      data: response?.data,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error sending notification.',
      error,
    });
  }
}
```

<p>Ambos endpoints ('/send' y '/send-no-deps') funcionan de la misma forma, la diferencia es que '/send' realiza la autenticación contra firebase a través de una dependencia y '/send-no-deps' autentica sin utilizar ninguna dependencia de firebase.</p>

<p><b>api/notifications/register/user/:guId/device/:token</b> | Guarda guId del usuario y asocia el token del dispositivo al mismo:</p>

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
