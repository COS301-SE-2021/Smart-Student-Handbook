import { Note } from './note.interface';

export interface Notebook {
	title: string;
	author: string;
	course: string;
	description: string;
	institution: string;
	name: string;
	private: boolean;
	notebookReference: string;
	notes?: Note[];
}
