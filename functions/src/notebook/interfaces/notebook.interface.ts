import { Note } from './note.interface';
import { Access } from './access.interface';

export interface Notebook {
	title: string;
	author: string;
	course: string;
	description: string;
	institution: string;
	creatorId: string;
	private: boolean;
	notebookId: string;
	tags?: string[];
	notes?: Note[];
	access?: Access[];
}
