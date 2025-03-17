import {globalLogger as log} from "@/utils/log";
import {IconProvider, IIconProviderArgs} from "@/providers/icon/icon.provider";
import {Icon} from "@/providers/icon/icon";

export default class CustomIconProvider extends IconProvider {
	constructor () {
		const args: IIconProviderArgs = {
			name: 'custom',
			description: 'Custom icon provider, supporting base64 encoding',
			external: false,
			cacheKey: "icon_custom_",
		}
		
		super(args);
	}
	
	async resolve (icon: Icon): Promise<string> {
		if (!icon) throw new Error("No icon provided");
		if (!icon?.encoded) throw new Error("No encoded data provided");
		if (!icon.encoded.startsWith("data:image/svg")) throw new Error("Malformed or invalid data provided");
		
		log.std(`Resolving ${icon.slug} icon with ${this.name}...`)
		
		const encodedData: string = icon.encoded!;
		const encodedContent: string|undefined = encodedData.split(",")?.[1]?.replaceAll(" ", "+");

		if (!encodedContent) throw new Error('Invalid value for custom encoded SVG');
		
		const decodedSVG: string = Buffer.from(encodedContent, "base64").toString("utf-8");
		
		if (!decodedSVG) throw new Error("Failed to decode custom icon from base64");
		
		return decodedSVG;
	}
}