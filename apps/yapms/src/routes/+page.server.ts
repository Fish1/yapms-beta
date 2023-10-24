import type { PageServerLoad } from './$types';
import { globSync } from 'glob';
import fs from 'fs';

export const load: PageServerLoad = () => {
	const files = globSync('./src/lib/assets/maps/**/*.svg');

	const search = [];

	for (const file of files) {
		const data = fs.readFileSync(file, 'utf8');
		const title = data.match(/title=['"](?<title>[^'"]*)['"]/)?.groups?.['title'];
		if (title === undefined) {
			continue;
		}
		const route = '/app/' + file.split('/').pop()?.split('.').at(0)?.replaceAll('-', '/');
		search.unshift({
			title,
			route
		});
	}

	return {
		post: {
			search
		}
	};
};

export const prerender = true;
