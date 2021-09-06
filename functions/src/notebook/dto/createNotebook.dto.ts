export class CreateNotebookDto {
	readonly title: string;

	readonly author: string;

	readonly course: string;

	readonly description: string;

	readonly institution: string;

	readonly private: boolean;

	readonly tags: string[];
}
