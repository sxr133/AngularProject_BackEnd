import { Boom } from '@hapi/boom';
import { db } from '../database';
import * as admin from 'firebase-admin';

export const getUserListingsRoute = {
  method: 'GET',
  path: '/api/users/{userId}/listings',
  handler: async (request, h) => {
    // Extract token from the Authorization header
    const authHeader = request.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    console.log('Token:', token);

    if (!token) throw Boom.unauthorized('Authorization token missing!');

    try {
      const user = await admin.auth().verifyIdToken(token);
      console.log('Verified User ID:', user.user_id);

      if (user.user_id !== request.params.userId) {
        throw Boom.unauthorized('Users can only access their own listings!');
      }

      const userId = request.params.userId;
      const { results } = await db.query('SELECT * FROM listings WHERE user_id = ?', [userId]);

      console.log('Listings:', results);
      return results;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw Boom.unauthorized('Invalid authorization token!');
    }
  },
};