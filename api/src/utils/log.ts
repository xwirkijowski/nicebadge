import {Eudoros, Config} from 'eudoros';

const config: Config = {
	options: {
		outputDirectory: './logs',
		synchronous: true,
		formatArgs: false,
		globalFormat: (level, context, prefix, timestamp, payload, domain): string => {
			if (context === 'payload') {
				const format = (level.format && Array.isArray(level.format) && level.format.length > 0)
					?  level.format
					: ['', ''];
				
				return (level.trace)
					? `${prefix}${payload}`
					: `${timestamp}${domain??''}${prefix}${format[2]||''}${payload}${format[3]||''}`;
			} else {
				const format: string[] = (level?.trace?.format && Array.isArray(level.format) && level.trace.format.length > 0)
					?  level.trace.format
					: ['', ''];
				
				domain = (domain)
					? `${format[0]}[${domain}]${format[1]}` + " "
					: '';
				
				return timestamp+domain+prefix+level.trace?.groupLabel||'';
			}
		}
	},
	levels: [
		{
			label: 'success',
			prefix: `\x1b[42m SUCCESS \x1b[0m`, // Green
			format: ['\x1b[90m', '\x1b[0m'], // Green
			logToFile: true,
		},
		{ // Warnings, expected exceptions
			label: 'warn',
			consoleMethodName: 'warn',
			prefix: `\x1b[33m[\u{26A0}]\x1b[0m`, // Yellow
			format: ['\x1b[33m', '\x1b[0m'], // Yellow
			logToFile: true,
		},
		{ // Non-critical errors
			label: 'error',
			consoleMethodName: 'error',
			prefix: `\x1b[31m[\u{2717}]\x1b[0m`, // Red
			format: ['\x1b[31m', '\x1b[0m'], // Red
			trace: {
				groupLabel: 'Non-critical error occurred.',
				groupPrefix: '\x1b[31m[\u{26A0}]\x1b[0m',
				format: ['\x1b[31m', '\x1b[0m'],
			},
			logToFile: true,
		},
		{ // Critical errors that cause performance degradation or shutdown
			label: 'fatal',
			consoleMethodName: 'error',
			prefix: `\x1b[31m[\u{2717}]\x1b[0m`, // red
			format: ['\x1b[5m\x1b[31m', '\x1b[0m', '\x1b[31m', '\x1b[0m'], // Bold, red
			trace: {
				groupLabel: 'Fatal error occurred.',
				groupPrefix: '\x1b[31m[\x1b[33mfatal\x1b[31m]\x1b[0m',
				format: ['\x1b[90m', '\x1b[0m'],
			},
			logToFile: true,
		},
		{ // Information
			label: 'info',
			consoleMethodName: 'info',
			prefix: '\x1b[44m INFO \x1b[0m',
			format: ['\x1b[90m', '\x1b[0m'],
			logToFile: true,
		},
		{
			label: 'request',
			consoleMethodName: 'log',
			prefix: '\x1b[46m REQ \x1b[0m',
			format: ['\x1b[90m', '\x1b[0m'],
			logToFile: "request",
		},
		{
			label: 'response',
			consoleMethodName: 'log',
			prefix: '\x1b[45m RES \x1b[0m',
			format: ['\x1b[90m', '\x1b[0m'],
			logToFile: "response",
		},
		{
			label: 'std',
			consoleMethodName: 'log',
			prefix: '\x1b[100m LOG \x1b[0m',
			format: ['\x1b[90m', '\x1b[0m'],
			logToFile: true,
		},
	]
}

export const globalLogger = new Eudoros(config);
