const { env } = require("../env");
const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
    dialect: 'mysql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});