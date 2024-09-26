import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

/*export const dataSourceOptions: DataSourceOptions = {
    type: "mongodb",
    url: env.DATABASE_URL,
    database: env.DATABASE_NAME,
    useUnifiedTopology: true,
    synchronize: false,  // Set to false in production
    logging: ["error", "query"],
}*/

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || "3306"),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [
        __dirname + '/**/entities/*.ts',
        __dirname + '/**/entities/*.js'
    ],
    migrations: [
        __dirname + '/**/migrations/*.ts',
        __dirname + '/**/migrations/*.js'
    ],
    //logging: ["error", "query"],
    synchronize: false,
    debug: false,
}

export const dataSource = new DataSource(dataSourceOptions);