import {pathToFileURL} from "node:url";
import {readdirSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";

import {IconProvider, TIconProvider} from "@/providers/icon/icon.provider";

const __dirname: string = dirname(fileURLToPath(import.meta.url));

class NiceBadge {
	timestampStart?: Date;
	timestampListen?: Date;
	
	readonly iconProviderList: TIconProvider[] = [];
	readonly iconProviderNames: string[] = [];
	
	redisInstance?: unknown;
	
	requests?: number
	
	setStartTimestamp(date: Date): void {this.timestampStart = date;}
	setListenTimestamp (date: Date): void {this.timestampListen = date;}
	
	async registerIconProviders (): Promise<void> {
		const directory: string = join(__dirname, "providers/icon");
		const providers: string[] = readdirSync(directory)
			.filter((file: string): boolean => !!file.match(/^icon\.provider\.(.+)(?<!test)\.ts$/));
		
		for (const module of providers) {
			const {default: ProviderClass} = await import(pathToFileURL(join(directory, module)).href);
			
			// Check if ProviderClass extends IconProvider
			if (Object.getPrototypeOf(ProviderClass.prototype).constructor.name === IconProvider.prototype.constructor.name) {
				const provider = new ProviderClass()
				
				this.iconProviderList.push(provider);
				this.iconProviderNames.push(provider.name);
			}
		}
	}
	
	getIconProvider (name: string): TIconProvider|undefined {
		return this.iconProviderList.find((item: TIconProvider): boolean => item.name === name.toLowerCase());
	}
	
	getIconProviderNames (): string[] {
		return this.iconProviderNames;
	}
}

const singleton: NiceBadge = new NiceBadge();
export default singleton;

export type RegisteredIconProviders = typeof singleton.iconProviderNames[number];