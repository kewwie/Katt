const { env } = require("./env");

module.exports.Database = require("kenx")({
    client: "mysql",
    connection: {
        host : env.DB_HOST,
        port : env.DB_PORT,
        user : env.DB_USER,
        password : env.DB_PASSWORD,
        database : env.DB_NAME
    }
});