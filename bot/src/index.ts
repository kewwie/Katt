import { KiwiClient } from "./client";
import { env } from "./env";

const client = new KiwiClient();
console.log(env.CLIENT_TOKEN)

client.login(env.CLIENT_TOKEN);