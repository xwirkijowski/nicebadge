import {TFont} from "./assets/fonts";
import {TIcon} from "./assets/icons";

import {registerFont} from "canvas";

class NiceBadge {
	startup?: Date
	
	requests?: number
	
	areFontsLoaded: boolean = false;
	areIconsLoaded: boolean = false;
	arePresetsLoaded: boolean = false;
	
	fonts: string[] = [];
	icons: TIcon[] = [];
	
	setStartup (date: Date): void {
		this.startup = date;
	}
	
	setupFonts (fontList: TFont[]): void {
		if (this.areFontsLoaded) return;
		
		fontList.forEach(font => {
			registerFont(`./src/assets/fonts/${font.fileName}`, {
				family: font.family,
				weight: font.weight,
				style: font.style
			})
			
			this.fonts.push(font.family)
		})
		
		this.areFontsLoaded = true;
	}
	
	applyIcons (iconList: TIcon[]): void {
		this.icons = iconList;
		this.areIconsLoaded = true;
	}
}

export default new NiceBadge();