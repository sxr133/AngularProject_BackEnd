import Hapi, { server } from '@hapi/hapi';
import routes from './routes';  
import { db } from './database';
import * as admin from 'firebase-admin';
import credentials from '../credentials.json';

admin.initializeApp( {
  credential: admin.credential.cert(credentials)
});

const start = async () => {
  const server = Hapi.server({
    port: 8000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:4200'], // Allow specific origin
        headers: ['Accept', 'Content-Type', 'Authorization'], // Allowed headers
        exposedHeaders: ['Accept', 'Content-Type'], // Exposed headers
        additionalExposedHeaders: ['X-Requested-With'],
        maxAge: 60,
        credentials: true, // Allow cookies if required
      },
    },
  });

  routes.forEach(route => {
    server.route(route);
  });

  db.connect();
  await server.start();
  console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Stopping server...');
  await server.stop({timeout: 10000});
  db.end();
  console.log('Server stopped');
  process.exit(0);
});

start();