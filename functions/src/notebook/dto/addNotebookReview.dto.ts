export class AddNotebookReviewDto {
	readonly notebookId: string;

	readonly message: string;

	readonly rating: number;

	readonly displayName: string;

	readonly profileUrl: string;
}
