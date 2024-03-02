const { DataSource, DataSourceOptions } = require("typeorm");
const { env } = require("../env");

module.exports = dataSourceOptions = {
    type: "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
}

module.exports.dataSource = new DataSource(dataSourceOptions);