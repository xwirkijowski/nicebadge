declare namespace Express {
	export interface Request {
		requestId: string;
		timestamp: Date;
	}
	export interface Response {
		jsonFull: (data: object) => void;
	}
}