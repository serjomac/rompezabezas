// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://postgres:admin@localhost/dbPuzzle'
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }
};
