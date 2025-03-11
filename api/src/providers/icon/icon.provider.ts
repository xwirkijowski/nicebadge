import {Icon} from "@/providers/icon/icon";

export interface IIconProviderArgs {
	name: string;
	description?: string;
	cacheKey?: string;
	external: boolean;
	externalLink?: string;
}

export class IconProvider {
	name: string;
	description?: string;
	cacheKey?: string;
	external: boolean;
	externalLink?: string;
	
	constructor (args: IIconProviderArgs) {
		this.name = args.name;
		this.description = args?.description;
		this.cacheKey = args?.cacheKey || this.name.toLowerCase();
		this.external = args.external;
		this.externalLink = args?.externalLink;
	}
	
	async resolve (icon: Icon): Promise<string> {
		throw new Error('Not implemented');
	}
}

export type TIconProvider = InstanceType<typeof IconProvider>;
export type TIconProviderClass = IconProvider;