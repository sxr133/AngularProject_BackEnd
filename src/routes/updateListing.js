import { db } from '../database';
import * as admin from 'firebase-admin';


export const updateListingRoute = {
  method: 'POST',
  path: '/api/listings/{id}',
  handler: async (request, h) => {
    const { id } = request.params;
    const { name, description, price } = request.payload;
    const token = request.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
      return h.response({ error: 'Authorization token is missing or malformed' }).code(400);
    }
    console.log('Token:', token);
    // Attempt to verify the token
    const user = await admin.auth().verifyIdToken(token);
    const userId = user.user_id;
    console.log('Verified User ID:', user.user_id);
    await db.query(`
      UPDATE listings
      SET name = ?, description = ?, price = ?
      WHERE id = ? AND user_id = ?;
      `,
      [name, description, price, id, userId]);

      const {results} = await db.query(
        'SELECT * FROM listings WHERE id = ? AND user_id = ?;',
        [id, userId],
    );

    return results[0];
  }
}