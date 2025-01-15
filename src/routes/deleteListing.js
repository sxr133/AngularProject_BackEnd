import { db } from '../database'; 
import * as admin from 'firebase-admin';

export const deleteListingRoute = {
  method: 'DELETE',
  path: '/api/listings/{id}',
  handler: async (request, h) => {
    const { id } = request.params;
    const token = request.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
      return h.response({ error: 'Authorization token is missing or malformed' }).code(400);
    }
    console.log('Token:', token);
    // Attempt to verify the token
    const user = await admin.auth().verifyIdToken(token);
    const userId = user.user_id;

    await db.query(
      'DELETE FROM listings WHERE id = ? AND user_id=?', 
      [id, userId],
    );
    return { message: 'Success!' };
  }
}