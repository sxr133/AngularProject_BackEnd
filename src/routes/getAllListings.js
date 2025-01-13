import { db } from '../database';

export const getAllListingsRoute = {
  method: 'GET',
  path: '/api/listings',
  handler: async (request, h) => {
    const {results} = await db.query(
      'SELECT * FROM listings'
    );
    return results;
  },
}