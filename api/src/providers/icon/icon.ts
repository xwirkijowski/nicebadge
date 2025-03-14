import {TIconProvider} from "@/providers/icon/icon.provider";
import NiceBadge, {RegisteredIconProviders} from "@/nicebadge";

export class Icon {
	slug?: string;
	encoded?: string;
	provider?: RegisteredIconProviders;
	svg?: string;
	
	constructor (queryIcon: string, provider: RegisteredIconProviders = "simple-icons", svg?: string) {
		if (queryIcon.startsWith("data:image/svg")) { // Recognize pattern and force provider to `custom`
			this.encoded = queryIcon;
			this.provider = "custom";
		} else {
			this.slug = queryIcon;
		}
		
		this.provider ||= provider;
		this.svg = svg;
	}
	
	/**
	 * Resolve icon slug or encoded value to SVG by using appropriate provider.
	 *
	 * @async
	 */
	async resolve (): Promise<this> {
		if (!this.provider) { throw new Error('No provider provided'); }
		if (!NiceBadge.iconProviderNames.includes(this.provider)) { throw new Error('Provider not on registered provider list'); }
		
		const provider: TIconProvider|undefined = NiceBadge.getIconProvider(this.provider);
		if (!provider) { throw new Error('Could not find provider'); }
		
		try {
			const resolvedIcon: string = await provider.resolve(this)
			this.svg = (resolvedIcon) ? resolvedIcon : ''; // @todo: Implement some kind of fallback icon
		} catch (e) {
			console.error('Failed to resolve', e);
		}
		
		return this;
	}
}