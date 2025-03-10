import {globalLogger as log} from "@/utils/log";

type TIconProvider = "custom"|"nicebadge"|"simple-icons";

function simpleIconURL (slug: string): string {
	return `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`;
}

export class Icon {
	slug?: string;
	encoded?: string;
	provider?: TIconProvider;
	svg?: string;
	
	constructor (queryIcon: string, provider: TIconProvider = "simple-icons", svg?: string) {
		if (queryIcon.startsWith("data:image/svg")) {
			this.encoded = queryIcon;
			this.provider = "custom";
		} else {
			this.slug = queryIcon;
		}
		
		this.provider ||= provider;
		this.svg = svg;
	}
	
	async resolve () {
		if (!this.provider) { throw new Error('No provider provided'); }
		
		try {
			if (this.provider === "custom") {
				const encodedSVG: string|undefined = this.encoded!.split(",").pop()?.replaceAll(" ", "+");
				if (!encodedSVG) throw new Error('Invalid value for custom encoded SVG');
				
				this.encoded = encodedSVG;
				const customIcon: string = Buffer.from(this.encoded, "base64").toString("utf-8");
				
				if (customIcon) this.svg = customIcon;
			} else if (this.provider === "simple-icons") {
				const simpleIcon: string|null = await this.getSimpleIcon();
				
				if (simpleIcon) this.svg = simpleIcon;
			} else if (this.provider === "nicebadge") {
				throw new Error ("Not implemented");
			}
			
			if (!this.svg) this.svg = '' // @todo: Implement some kind of fallback icon
			
			return this;
		} catch (e) {
			console.error('Failed to resolve', e);
		}
	}
	
	private async getSimpleIcon (): Promise<string|null> {
		if (this.provider !== "simple-icons" || !this.slug) throw new Error('Wrong provider or no icon slug');
		
		log.std(`Resolving icon (${this.slug}) from Simple-icons...`)
		
		// Attempt to get cache
		
		try {
			const res = await fetch(simpleIconURL(this.slug));
			const svg: string = await res.text();
			
			if (!svg) return null;
			
			// If resolved store to cache
			
			return svg;
		} catch (e) {
			console.error('Error while resolving simple-icon', e);
			throw e;
		}
	}
}