import {registerFont} from "canvas";

class NiceBadge {
	startup?: Date
	
	requests?: number
	
	setStartup (date: Date): void {
		this.startup = date;
	}
}

export default new NiceBadge();