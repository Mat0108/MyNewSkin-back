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
  url: 'mongodb+srv://mesjeux0108:UGVW5NmsJJRpwXdV@cluster0.ph0tm0m.mongodb.net/?retryWrites=true&w=majority'
};
