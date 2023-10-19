const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_URL
} = process.env;
require("dotenv").config();
module.exports = {
  url: process.env.DATABASE_URL
};
