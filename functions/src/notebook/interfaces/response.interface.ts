import { Notebook } from './notebook.interface';

export interface Response {
	message: string;
	notebookId?: string;
	noteId?: string;
	notebook?: Notebook;
}
