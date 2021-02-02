//This class is just for reducing duplicated code
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  host: process.env.HOST,
  port: process.env.PORT,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.DATABASE,
  user: process.env.MYSQL_USER,
};
