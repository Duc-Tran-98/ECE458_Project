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
        type: SQL.STRING(500),
        allowNull: false,
      },
      lastName: {
        type: SQL.STRING(128),
        allowNull: false,
      },
      userName: {
        type: SQL.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: SQL.STRING(256),
        allowNull: false,
      },
      createdAt: SQL.DATE,
      updatedAt: SQL.DATE,
      email: {
        type: SQL.STRING(320),
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
        type: SQL.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      modelNumber: {
        type: SQL.STRING(40),
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: SQL.STRING(100),
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

  const modelCategoryRelationships = db.define(
    'modelCategoryRelationships',
    {
      modelId: {
        type: SQL.INTEGER,
        allowNull: false,
      },
      modelCategoryId: {
        type: SQL.INTEGER,
        allowNull: false,
      },
      taggableType: {
        type: SQL.STRING,
      },
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    as: 'categories',
    through: {
      model: 'modelCategoryRelationships',
      unique: false,
    },
    sourceKey: 'id',
    foreignKey: 'modelId',
    constraints: false,
  });
  modelCategories.belongsToMany(models, {
    as: 'models',
    through: {
      model: 'modelCategoryRelationships',
      unique: false,
    },
    sourceKey: 'id',
    foreignKey: 'modelCategoryId',
    constraints: false,
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
        type: SQL.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      modelNumber: {
        type: SQL.STRING(40),
        primaryKey: true,
        allowNull: false,
      },
      serialNumber: {
        type: SQL.STRING(40),
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
        type: SQL.STRING(100),
        allowNull: false,
      },
      id: {
        type: SQL.INTEGER,
        autoIncrement: true,
        unique: true,
      },
      assetTag: {
        type: SQL.INTEGER,
        unique: true,
      },
    },
    {
      freezeTableName: true,
    },
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
  );

  const instrumentCategories = db.define(
    'instrumentCategories',
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

  const instrumentCategoryRelationships = db.define(
    'instrumentCategoryRelationships',
    {
      id: {
        type: SQL.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

  instruments.belongsToMany(instrumentCategories, {
    as: 'instrumentCategories',
    through: {
      model: 'instrumentCategoryRelationships',
      unique: false,
    },
    sourceKey: 'id',
    targetKey: 'id',
  });
  instrumentCategories.belongsToMany(instruments, {
    as: 'instruments',
    through: {
      model: 'instrumentCategoryRelationships',
      unique: false,
    },
    sourceKey: 'id',
    targetKey: 'id',
  });

  instruments.belongsToMany(modelCategories, {
    as: 'modelCategories',
    through: {
      model: 'modelCategoryRelationships',
      unique: false,
    },
    sourceKey: 'modelReference',
    foreignKey: 'modelId',
    constraints: false,
  });
  modelCategories.belongsToMany(instruments, {
    as: 'instrumentsOfModels',
    through: {
      model: 'modelCategoryRelationships',
      unique: false,
    },
    sourceKey: 'id',
    foreignKey: 'modelCategoryId',
    constraints: false,
  });

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
      fileLocation: SQL.STRING,
      fileName: SQL.STRING,
    },
    { freezeTableName: true },
    {
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    },
  );

  instruments.hasMany(calibrationEvents, {
    as: 'recentCalibration',
    sourceKey: 'id',
    foreignKey: 'calibrationHistoryIdReference',
    constraints: false,
  });

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
    modelCategoryRelationships,
    instrumentCategories,
    instrumentCategoryRelationships,
  };
};
