import {createClient} from "redis";
import config from "@/config";

const client = createClient({
	url: (config.REDIS_URL as string) || `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`
});

// @todo: Circuit breaker
// @todo: Exponential backoff retries

client.on('error', (err) => {
	console.log(err);
})

await client.connect();

export default client;