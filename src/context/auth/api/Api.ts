import { LibraryItem } from './types/libraryitem';
import { LibraryItemRequest } from '../../../types/app/libraryitem';

interface Fetchoptions {
	devStatus?: number;
}

export class Api {
	constructor() {}

	private async fetch(
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
		url: string,
		body?: any,
		options?: Fetchoptions
	) {
		const req: RequestInit = {
			method,
			body,
		};
		if (import.meta.env.DEV) {
			req.mode = 'no-cors';
		}
		let response = await fetch(`${import.meta.env.VITE_API}${!url.startsWith('/') ? '/' : ''}${url}`, req);
		if (import.meta.env.DEV) {
			response = new Response(response.body, { ...response, status: options?.devStatus ?? 0 });
		}
		return response;
	}

	async get(url: string, options?: Fetchoptions) {
		return this.fetch('GET', url, undefined, options);
	}

	async post(url: string, body: any, options?: Fetchoptions) {
		return this.fetch('POST', url, body, options);
	}

	async getLibraryItems(): Promise<LibraryItem[]> {
		return [];
	}

	async createLibraryItem({ file, ...item }: LibraryItemRequest) {
		const formData = new FormData();
		formData.append('file', file);
		const metadata = { ...item, fileName: file.name, fileType: file.type, date: item.date.toISOString() };
		formData.append('metadata', JSON.stringify(metadata));

		return this.post('/upload', formData, { devStatus: 200 });
	}
}
