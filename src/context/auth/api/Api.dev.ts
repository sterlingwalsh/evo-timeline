import { Api } from './Api';
import { LibraryItem } from './types/libraryitem';

export class DevApi extends Api {
	async getLibraryItems(): Promise<LibraryItem[]> {
		const json = (await import('./testdata/library.json')).default as unknown as LibraryItem[];
		return json.map((d) => ({
			...d,
			date: new Date(d.date),
		}));
	}
}
