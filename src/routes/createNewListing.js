import { v4 as uuid } from 'uuid';  
import { db } from '../database';
import * as admin from 'firebase-admin';

export const createNewListingRoute = {
  method: 'POST',
  path: '/api/listings',
  handler: async (request, h) => {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return h.response({ error: 'Authorization token is missing or malformed' }).code(400);
      }
      // Attempt to verify the token
      const user = await admin.auth().verifyIdToken(token);
      const userId = user.user_id;
      console.log('Verified User ID:', userId);
    
      // Proceed with creating the listing
      const id = uuid();
      const { name = '', description = '', price = 0 } = request.payload;
      const views = 0;
    
      await db.query(
        `INSERT INTO listings (id, name, description, price, user_id, views) VALUES (?, ?, ?, ?, ?, ?);`,
        [id, name, description, price, userId, views]
      );
    
      return h.response({ id, name, description, price, user_id: userId, views }).code(201);
    
    } catch (error) {
      console.error('Error verifying token:', error);
      return h.response({ error: 'Invalid or expired token' }).code(401); // Change to 401 for invalid token
    }
  }
}