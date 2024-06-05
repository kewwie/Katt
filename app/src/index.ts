import { KiwiClient } from "./client";
import { env } from "./env";

import { dataSource } from "./datasource";
dataSource.initialize();

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);