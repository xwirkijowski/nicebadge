import {globalLogger as log} from "@/utils/log";
import {NiceError} from "@/utils/error";

export const configTimeStamp: Date = new Date();
export const configPerformance: number = performance.now();

log.std("Starting NiceBadge instance...");

type TConfigParameter = {
	type: "string" | "number" | "boolean",
	required?: boolean,
	default?: string|number|boolean,
};

/**
 * Config parameters as an object.
 * Trading larger memory usage for faster performance.
 */
 const configParameters: Record<string, TConfigParameter> = {
	PORT: {type: "number", default: 3000},
	REDIS_URL: {type: "string"},
	REDIS_HOST: {type: "string", default: "127.0.0.1"},
	REDIS_PORT: {type: "number", default: 6379},
	POSTGRES_URL: {type: "string"},
	POSTGRES_HOST: {type: "string", default: "127.0.0.1"},
	POSTGRES_PORT: {type: "number", default: 5432},
	POSTGRES_USER: {type: "string"},
	POSTGRES_PASS: {type: "string"},
};

const config: Record<keyof typeof configParameters, string|number|boolean> = {};

/**
 * Parses environment variables based on the defined config parameters.
 * Leverages type coercion and validates parsing.
 *
 * @param   name    Name of the configuration parameter
 * @param   param   Configuration parameter
 * @param   value   Value of the environment variable
 */
function parseConfigValue (name: string, param: TConfigParameter, value: string): string|number|boolean {
	switch (param.type) {
		case "boolean":
			return (value.toLowerCase() === "true");
		case "number":
			const num: number = Number(value);
			if (isNaN(num)) {
				log.fatal(`Failed to parse ${name} environment variable value, received ${value}, shutting down...`);
				throw new NiceError('CONFIG_PARAM_NAN', `Invalid parameter "${name}" value, ${value}`);
			}
			return num;
		default:
			return value;
	}
}

/**
 * Iterate over defined configuration parameters and look up environment variables for values.
 */
for (const [name, param] of Object.entries(configParameters)) {
	const envValue: string|undefined = process.env[name];
	
	if (envValue) {
		config[name] = parseConfigValue(name, param, envValue);
		continue;
	}
	
	if (param.required) {
		log.fatal(`Could not load ${name} required environment variable, shutting down...`);
		process.exit(1);
	}
	
	if (param.default !== undefined) {
		config[name] = param.default;
		log.std(`Using default for ${name}: ${param.default}`)
	} else {
		log.std(`Optional environment variable ${name} not provided.`)
	}
}

log.info(`Config loaded in ${(performance.now() - configPerformance).toFixed(2)} ms.`)

export default Object.freeze(config);