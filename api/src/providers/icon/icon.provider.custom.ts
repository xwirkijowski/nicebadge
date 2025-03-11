import {IconProvider, IIconProviderArgs} from "@/providers/icon/icon.provider";
import {Icon} from "@/providers/icon/icon";

export default class CustomIconProvider extends IconProvider {
	constructor () {
		const args: IIconProviderArgs = {
			name: 'custom',
			description: 'Custom icon provider, supporting base64 encoding',
			external: false,
		}
		
		super(args);
	}
	
	async resolve (icon: Icon): Promise<string> {
		if (!icon) throw new Error("No icon provided");
		if (!icon?.encoded) throw new Error("No encoded data provided");
		
		const encodedData: string = icon.encoded!;
		const encodedContent: string|undefined = encodedData.split(",")?.pop()?.replaceAll(" ", "+");
		
		if (!encodedContent) throw new Error('Invalid value for custom encoded SVG');
		
		const decodedSVG: string = Buffer.from(encodedContent, "base64").toString("utf-8");
		
		if (!decodedSVG) throw new Error("Failed to decode custom icon from base64");
		
		return decodedSVG;
	}
}