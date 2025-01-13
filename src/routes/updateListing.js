import { db } from '../database';


export const updateListingRoute = {
  method: 'POST',
  path: '/api/listings/{id}',
  handler: async (request, h) => {
    const { id } = request.params;
    const { name, description, price } = request.payload;
    const userId = '12345'

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