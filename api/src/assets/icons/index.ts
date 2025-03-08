import p from "path";
import fs from 'fs';
import {fileURLToPath} from "url";

const __dirname = p.dirname(fileURLToPath(import.meta.url));

export type TIcon = {
	name: string
	svg: string
}

const IconList: TIcon[] = [];

fs.readdir(__dirname, {withFileTypes: true}, (err, files) => {
	if (!files) return;
	
	files.forEach(({name, path}) => {
		if (name.endsWith('.svg')) {
			console.log(`Loading icon: ${name}...`);
			
			const svg = fs.readFileSync(p.join(path, name), {encoding: "utf-8"});
			
			IconList.push({
				name: name.split('.')[0],
				svg,
			})
		}
	})

	console.log(`Loaded ${IconList.length} icons!`);
})

export default IconList;