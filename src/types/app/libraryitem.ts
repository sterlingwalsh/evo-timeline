export interface LibraryItem {
	author: string;
	date: Date;
	fileName: string;
	fileSHA256: string;
	fileType: string;
	fileViewUrl: string;
	metadataFileName: string;
	scientificField: string;
	tags: string[];
	title: string;
	virusTotalReport: string;
}

export type LibraryItemRequest = Pick<LibraryItem, 'author' | 'date' | 'scientificField' | 'tags' | 'title'> & {
	file: File;
};
