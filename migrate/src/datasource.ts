import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || "3306"),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    migrations: ['dist/**/migrations/*.js'],
    synchronize: false,
    debug: false,
}

export const dataSource = new DataSource(dataSourceOptions);