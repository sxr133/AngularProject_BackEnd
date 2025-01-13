import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hapi-server',
  password: 'Wabush#002',
  database: 'buy-and-sell',
});

export const db = {
  connect: () => connection.connect(),
  query: (queryString, escapedValues) => 
    new Promise((resolve, reject) => {
      connection.query(queryString, escapedValues, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve({results, fields});
        }
      })
    }), 
    end: () => connection.end(),
}
