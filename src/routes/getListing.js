import Boom from "@hapi/boom";
import { db } from "../database";

export const getListingRoute = {
  method: 'GET',
  path: '/api/listings/{id}',
  handler:  async (request, h) => {
    const id = request.params.id;
    const { results } = await db.query (
      'SELECT * FROM listings WHERE id = ?',
      [id],
    );

    const listing = results[0];
    if (!listing) throw Boom.notFound(`No listing found with id ${id}`);
      return listing;
  }
}