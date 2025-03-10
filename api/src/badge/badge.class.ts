import {Icon} from "./icon";

import {Canvas, CanvasRenderingContext2D, createCanvas, TextMetrics} from "canvas";

type TBadgeSize = {
	paddingX: number;
	paddingY: number;
	fontSize: number;
	iconSize: number;
	rx: number;
}

const sizes: Record<string, TBadgeSize> = {}

sizes.small = {
	paddingX: 4,
	paddingY: 3,
	fontSize: 12,
	iconSize: 16,
	rx: 2,
}

sizes.medium = {
	paddingX: 4,
	paddingY: 3,
	fontSize: 12,
	iconSize: 16,
	rx: 2,
}

sizes.large = {
	paddingX: 4,
	paddingY: 3,
	fontSize: 16,
	iconSize: 16,
	rx: 2,
};

// @todo: Switch to table lookup for text calculation

export class Badge {
	icon?: string;
	iconInstance?: Icon;
	iconColor?: string;
	label?: string;
	labelColor: string = '#ffffff';
	labelBg?: string = '#111111';
	labelMetrics?: TextMetrics;
	msg?: string;
	msgColor: string = '#111111';
	msgBg?: string = '#eeeeee';
	msgMetrics?: TextMetrics;
	font: string = 'Inter';
	size: string = 'medium';
	sizeObj: TBadgeSize = sizes.medium;
	
	[field: string]: string | unknown;
	
	constructor(args: any) {
		const fields: string[] = [
			'icon',
			'iconColor',
			'label',
			'labelColor',
			'labelBg',
			'msg',
			'msgColor',
			'msgBg',
			'font',
			'size',
		]
		
		fields.forEach((field: string): void => {
			if (args[field]) {
				const value: string = String(args[field]).normalize("NFKD").trim();
				
				if (field.endsWith('Color') || field.endsWith('Bg')) this[field] = this.parseColor(value);
				else this[field] = value;
			}
		});
		
		if (this.size in sizes) this.sizeObj = sizes[this.size];
		
		return this;
	}
	
	async resolveIcon () {
		if (!this.icon) return;
		
		try {
			this.iconInstance = await new Icon(this.icon).resolve();
		} catch (e) {
			console.error(e);
		}
		
		return this;
	}
	
	private calculateContent () {
		// Fallback content
		if (!this.iconInstance && !this.label && !this.msg) {
			this.label = "NiceBadge";
			this.msg = "Make your own";
		}
		
		this.title = ((this.label) ? `${this.label} | ${this.msg}` : this.msg) || 'NiceBadge';
		
		this.labelMetrics = (this.label) ? this.getTextMetrics(this.label, this.font) : undefined;
		this.msgMetrics = (this.msg) ? this.getTextMetrics(this.msg, this.font) : undefined;
		
		// No content
		if (!this.icon && !this.labelMetrics && !this.msgMetrics) throw new Error('Cannot create empty badge!');
		
		const metrics: TextMetrics|undefined = (this.msgMetrics || this.labelMetrics);
		
		const textY: number = (metrics)
			? this.sizeObj.paddingY + (this.sizeObj.iconSize / 2) + metrics.emHeightDescent + (metrics.alphabeticBaseline * -1)
			: 0;
		
		const height: number = (this.sizeObj.paddingY * 2) + this.sizeObj.iconSize;
		
		const sharedAttrs = {
			"font-family": this.font,
			"text-anchor": "start",
			"font-size": this.sizeObj.fontSize,
			"font-weight": 700,
		}
		
		const iconTag = this.icon ? {
			x: this.sizeObj.paddingX,
			y: this.sizeObj.paddingY,
			width: this.sizeObj.iconSize,
			height: this.sizeObj.iconSize,
			fill: this.iconColor || this.labelColor,
		} : undefined
		
		const labelTag = this.label ? {
			x: iconTag ? (this.sizeObj.paddingX * 2) + this.sizeObj.iconSize : this.sizeObj.paddingX,
			y: textY,
			textLength: Math.ceil(this.labelMetrics!.width * 1.01),
			fill: this.labelColor,
			...sharedAttrs
		} : undefined;
		
		const labelRect = this.label || this.icon ? {
			x: 0,
			y: 0,
			width: (labelTag?.textLength ?? 0) + (this.icon ? this.sizeObj.iconSize : 0) + (this.sizeObj.paddingX * (iconTag && labelTag ? 3 : 2)),
			height,
			fill: this.labelBg,
		}: undefined;
		
		const msgTag = this.msg ? {
			x: labelRect ? labelRect.width + this.sizeObj.paddingX : this.sizeObj.paddingX,
			y: textY,
			textLength: Math.ceil(this.msgMetrics!.width * 1.01),
			fill: this.msgColor,
			...sharedAttrs
		} : undefined;
		
		const msgRect = this.msg ? {
			x: labelRect?.width ?? 0,
			y: 0,
			width: msgTag!.textLength + (this.sizeObj.paddingX * 2),
			height,
			fill: this.msgBg,
		} : undefined;
		
		return {
			width: (labelRect?.width ?? 0) + (msgRect?.width ?? 0),
			height,
			iconTag,
			labelTag,
			labelRect,
			msgTag,
			msgRect,
		}
	}
	
	private getTextMetrics (text: string, font: string): TextMetrics {
		const canvas: Canvas = createCanvas(100,100);
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
		ctx.font = `${this.sizeObj.fontSize}px ${font}`;
		return ctx.measureText(text);
	}
	
	private attr (obj: object): string {
		return Object.entries(obj)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');
	}
	
	private parseColor (color: string): string {
		
		if (/^[0-9A-Fa-f]{6}$/.test(color)) {
			return `#${color}`;
		}
		
		return color;
	}
	
	toSVG (): string {
		const {width, height, iconTag, labelTag, labelRect, msgTag, msgRect} = this.calculateContent()
		
		const svgAttrs: string = this.attr({
			xmlns: 'http://www.w3.org/2000/svg',
			width: width,
			height: height,
			role: 'img',
			"aria-label": this.title || 'NiceBadge',
		})
		
		const clipRectAttr: string = this.attr({
			width: width,
			height: height,
			fill: "#ffffff",
			rx: `${this.sizeObj.rx}px`
		})
		
		/**
		 * @todo: Handle colors better, add functionality to replace all fills, if no color specified leave as is
		 */
		const nestedSVG: string|undefined = this.iconInstance?.svg?.replace('<svg', `<svg ${this.attr(iconTag!)}`);
		
		const svg: string[] = [
			`<svg ${svgAttrs}>`,
				`<title>${this.title}</title>`,
				`<clipPath id="border-radius"><rect ${clipRectAttr}></rect></clipPath>`,
				`<g clip-path="url(#border-radius)">`,
					...((this.label || this.icon) ? `<rect ${this.attr(labelRect!)}></rect>` : ''),
					...((this.label || this.icon) ? `<rect ${this.attr(labelRect!)}></rect>` : ''),
					...((this.msg) ? `<rect ${this.attr(msgRect!)}></rect>` : ''),
				`</g>`,
				`<g>`,
					...((nestedSVG) ? `${nestedSVG}` : ''),
					...((this.label) ? `<text ${this.attr(labelTag!)}>${this.label}</text>` : ''),
					...((this.msg) ? `<text ${this.attr(msgTag!)}>${this.msg}</text>` : ''),
				`</g>`,
			`</svg>`
		]
		
		return svg.join('');
	}
}