import config from "@/config";
import {NiceError} from "@/utils/error";
import {createClient} from "redis";

const redis = createClient({
	url: config.REDIS_URL as string || `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`
});

// @todo: Circuit breaker
// @todo: Exponential backoff retries

redis.on('error', (err) => {
	new NiceError(err?.code||'REDIS_UNKNOWN', err.message, err?.stack);
})

redis.connect()
	.catch((err) => {
		new NiceError(err?.code||'REDIS_UNKNOWN', err.message, err?.stack);
	});

export const RedisClient = redis;