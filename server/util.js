// This file handles connection to the database and initializing tables if they don't already exists
const SQL = require('sequelize');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('./config');

const {
  host,
  port,
  user,
  password,
  database,
  adminUsername,
  adminEmail,
  adminFirstName,
  adminLastName,
  adminPassword,
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
    // eslint-disable-next-line no-console
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    // eslint-disable-next-line no-console
    logging: console.log,
    database,
  });

  db.query('SET NAMES utf8mb4;');

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
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
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
      comment: {
        type: SQL.STRING(2000),
        allowNull: true,
      },
      calibrationFrequency: SQL.INTEGER,
    },
    { freezeTableName: true },
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
  );

  const modelCategories = db.define(
    'modelCategories',
    {
      id: {
        type: SQL.INTEGER,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: SQL.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
    { freezeTableName: true },
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
  );

  models.belongsToMany(modelCategories, {
    as: 'categories', through: 'modelCategoryRelationships', sourceKey: 'id', targetKey: 'id',
  });
  modelCategories.belongsToMany(models, {
    as: 'models', through: 'modelCategoryRelationships', sourceKey: 'id', targetKey: 'id',
  });

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
      comment: {
        type: SQL.STRING(2000),
        allowNull: true,
      },
      description: {
        type: SQL.STRING,
        allowNull: false,
      },
      id: {
        type: SQL.INTEGER,
        autoIncrement: true,
        unique: true,
      },
    },
    { freezeTableName: true },
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
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
          key: 'id',
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
      comment: SQL.STRING(2000),
    },
    { freezeTableName: true },
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
  );

  db.sync();
  const adminExist = await users.findAll({ where: { userName: adminUsername } });

  if (adminExist[0] == null) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, salt);
    users.create({
      email: adminEmail,
      firstName: adminFirstName,
      lastName: adminLastName,
      userName: adminUsername,
      password: hash,
      isAdmin: true,
    });
  }

  return {
    db,
    users,
    models,
    instruments,
    calibrationEvents,
    modelCategories,
    // modelCategoryRelationships,
  };
};
