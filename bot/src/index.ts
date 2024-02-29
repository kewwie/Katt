import { KiwiClient } from "./client";
import { env } from "./env";

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);