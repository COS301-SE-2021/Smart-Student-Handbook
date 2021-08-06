import { Note } from './note.interface';

export interface Notebook {
	title: string;
	author: string;
	course: string;
	description: string;
	institution: string;
	creatorId: string;
	private: boolean;
	notebookId: string;
	notes?: Note[];
}
