// This file handles connection to the database and initializing tables if they don't already exists
const SQL = require('sequelize');
const mysql = require('mysql2/promise');
const config = require('./config');

const {
  host, port, user, password, database,
} = config;

module.exports.createDB = async () => {
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  return await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\`;`,
  ); // create db if it doesn't exists
};

module.exports.createStore = async () => {
  const db = new SQL(database, user, password, {
    host,
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    port,
    logging: console.log,
    database,
  });

  const users = db.define(
    'users',
    {
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: SQL.STRING,
        allowNull: false,
      },
      lastName: {
        type: SQL.STRING,
        allowNull: false,
      },
      userName: {
        type: SQL.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: SQL.STRING,
        allowNull: false,
      },
      createdAt: SQL.DATE,
      updatedAt: SQL.DATE,
      email: {
        type: SQL.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: SQL.BOOLEAN,
        allowNull: false,
      },
    },
    { freezeTableName: true },
  );

  const models = db.define(
    'models',
    {
      id: {
        type: SQL.INTEGER,
        autoIncrement: true,
        unique: true,
      },
      vendor: {
        type: SQL.STRING,
        primaryKey: true,
        allowNull: false,
      },
      modelNumber: {
        type: SQL.STRING,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: SQL.STRING,
        allowNull: false,
      },
      comment: SQL.STRING(1024),
      calibrationFrequency: SQL.INTEGER,
    },
    { freezeTableName: true },
  );

  const instruments = db.define(
    'instruments',
    {
      modelReference: {
        type: SQL.INTEGER,
        allowNull: false,
        references: {
          model: 'models',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
      vendor: {
        type: SQL.STRING,
        primaryKey: true,
        allowNull: false,
      },
      modelNumber: {
        type: SQL.STRING,
        primaryKey: true,
        allowNull: false,
      },
      serialNumber: {
        type: SQL.STRING,
        primaryKey: true,
        allowNull: false,
      },
      calibrationFrequency: {
        type: SQL.INTEGER,
        allowNull: true,
      },
      comment: SQL.STRING(1024),
      calibrationHistoryId: {
        type: SQL.INTEGER,
        autoIncrement: true,
        unique: true,
      },
    },
    { freezeTableName: true },
  );

  const calibrationEvents = db.define(
    'calibrationEvents',
    {
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      calibrationHistoryIdReference: {
        type: SQL.INTEGER,
        allowNull: false,
        references: {
          model: 'instruments',
          key: 'calibrationHistoryId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user: {
        type: SQL.STRING,
        allowNull: false,
      },
      date: {
        type: SQL.DATEONLY,
        allowNull: false,
      },
      comment: SQL.STRING(1024),
    },
    { freezeTableName: true },
  );

  db.sync();

  return {
    db,
    users,
    models,
    instruments,
    calibrationEvents,
  };
};
