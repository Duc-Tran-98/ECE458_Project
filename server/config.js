// This class is just for reducing duplicated code
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  adminUsername: process.env.ADMIN_USERNAME,
  adminFirstName: process.env.ADMIN_FIRSTNAME,
  adminLastName: process.env.ADMIN_LASTNAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRedirectURI: process.env.OAUTH_REDIRECT_URI,
};
