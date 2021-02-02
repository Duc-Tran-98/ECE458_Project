// This file handles connection to the database and initializing tables if they don't already exists
const SQL = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

module.exports.createStore = () => {
  const db = new SQL('mydb', 'root', process.env.MYSQL_ROOT_PASSWORD, {
    host: 'mysql',
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    port: 3306,
    logging: console.log,
    database: 'mydb',
  });

  const users = db.define(
    'users',
    {
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: SQL.STRING,
      lastName: SQL.STRING,
      userName: { type: SQL.STRING, unique: true },
      password: SQL.STRING,
      createdAt: SQL.DATE,
      updatedAt: SQL.DATE,
      email: { type: SQL.STRING, unique: true },
      token: SQL.STRING,
    },
    { freezeTableName: true },
  );
  users.sync(); // create table in db if it doesn't exists; if it exits, do nothing

  return { db, users };
};
