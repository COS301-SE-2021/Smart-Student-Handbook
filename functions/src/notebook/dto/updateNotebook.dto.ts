export class UpdateNotebookDto {
	readonly title: string;

	readonly author: string;

	readonly course: string;

	readonly description: string;

	readonly institution: string;

	readonly private: boolean;

	readonly tags: string[];

	readonly notebookId: string;
}
