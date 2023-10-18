const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_URL
} = process.env;

module.exports = {
  url: DATABASE_URL
};
