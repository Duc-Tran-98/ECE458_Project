// This file handles connection to the database and initializing tables if they don't already exists
const SQL = require("sequelize");
const mysql = require("mysql2/promise");
const config = require("./config");

const { host, port, user, password, database } = config;

module.exports.createStore = async () => {
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`); //create db if it doesn't exists
  const db = new SQL(database, user, password, {
    host: host,
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    port: port,
    logging: console.log,
    database: database,
  });

  const users = db.define(
    "users",
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
    { freezeTableName: true }
  );
  users.sync(); //create table in db if it doesn't exists; if it exits, do nothing

  return { db, users };
};
