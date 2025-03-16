import {globalLogger as log} from "@/utils/log";

import {IconProvider, IIconProviderArgs} from "@/providers/icon/icon.provider";
import {Icon} from "@/providers/icon/icon";

export default class SimpleIconsIconProvider extends IconProvider {
	constructor () {
		const args: IIconProviderArgs = {
			name: 'simple-icons',
			description: 'Resolve simple-icons from slug',
			external: true,
			cacheKey: 'icon_simple-icons_',
		}
		
		super(args);
	}
	
	private getFetchUrl (slug: string): string {
		return `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`;
	}
	
	async resolve (icon: Icon): Promise<string> {
		if (!icon) throw new Error("No icon provided");
		if (!icon?.slug) throw new Error("No icon slug provided");
		
		log.std(`Resolving icon (${icon.slug}) from simple-icons...`)
		
		// Attempt to get cache
		
		let data: string;
		
		try {
			const response = await fetch(this.getFetchUrl(icon.slug!));
			data = await response.text();
		} catch (e) {
			console.error('Error while resolving simple-icon', e);
			throw e;
		}
		
		if (!data) throw new Error("Icon not found");
		
		return data;
	}
}