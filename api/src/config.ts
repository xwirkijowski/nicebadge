import { globalLogger as log } from "@/utils/log";

const configTimestamp: number = performance.now();

log.std("Starting NiceBadge instance...");

type TConfigParameter = {
	name: string,
	type: string,
	required?: boolean,
	default?: string|number|boolean,
}

const configParameters: TConfigParameter[] = [
	{
		name: 'PORT',
		type: 'number',
		default: 3000,
	}, {
		name: 'REDIS_URL',
		type: 'string',
	}
];

const config: Record<string, string|number|boolean> = {};

configParameters.forEach((param) => {
	if (process.env[param.name] && typeof process.env[param.name] === param.type) {
		config[param.name as string] = process.env[param.name]!;
	} else {
		if (!!param?.required) {
			log.fatal(`Could not load ${param.name} required environment variable, shutting down...`);
			process.exit(1);
		} else if (!!param?.default) {
			config[param.name as string] = param.default;
		} else {
			log.std(`Optional environment variable ${param.name} not provided.`)
		}
	}
})

log.info(`Finished loading configuration in ${(performance.now() - configTimestamp).toFixed(2)} ms.`)

export default config;