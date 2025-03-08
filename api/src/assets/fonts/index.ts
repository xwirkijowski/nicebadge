export type TFont = {
	fileName: string;
	family: string;
	weight?: string;
	style?: string;
}

const FontList: TFont[] = [
	{
		fileName: 'inter_bold.ttf',
		family: "Inter Custom",
		weight: "700"
	}
];

export default FontList;