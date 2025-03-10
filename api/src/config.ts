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
	if (process.env[param.name]) {
		let value: string|number|boolean = process.env[param.name]!;
		value = (param.type === 'boolean')
			? (value.toLowerCase() === "true")
			: (param.type === 'number')
				? Number(value)
				: value;
		
		if (param.type === 'number' && isNaN(value as number)) {
			log.fatal(`Failed to parse ${param.name} environment variable value, received ${value}, shutting down...`);
			throw new Error(`Invalid parameter "${param.name}" value, ${value}`);
		}
		
		config[param.name] = value;
	} else {
		if (!!param?.required) {
			log.fatal(`Could not load ${param.name} required environment variable, shutting down...`);
			process.exit(1);
		} else if (param?.default !== undefined) {
			config[param.name] = param.default;
			log.std(`Optional environment variable ${param.name} not provided, using default (${param.default}).`)
		} else {
			log.std(`Optional environment variable ${param.name} not provided.`)
		}
	}
})

log.info(`Finished loading configuration in ${(performance.now() - configTimestamp).toFixed(2)} ms.`)

export default config;