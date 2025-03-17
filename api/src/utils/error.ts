import {v4 as uuid} from "uuid";
import {globalLogger as log} from "@/utils/log";

export class NiceError extends Error {
	name: string = "NiceError";
	errorId: string;
	code: string;
	message: string;
	payload?: any;
	
	constructor(code = 'UNKNOWN', message?: string, ...payload: any[]) {
		super();
		
		this.errorId = uuid();
		this.code = code || 'UNKNOWN';
		this.message = message || 'UNKNOWN';
		
		// Capture stack trace and attach it to current error
		Error.captureStackTrace(this, this.constructor);
		
		this.payload = ((typeof payload === 'object' && Object.keys(payload).length > 0) || (Array.isArray(payload) && payload.length > 0)) ? payload : undefined;
	
		this.log();
		
		return this;
	}
	
	log (): this {
		log.error(this.code, this.message, this.payload, {errorId: this.errorId, stack: this.stack})
		
		return this;
	}
}