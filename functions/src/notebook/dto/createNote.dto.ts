export class CreateNoteDto {
	readonly name: string;

	readonly notebookId: string;

	readonly description: string;

	readonly tags: string[];
}
