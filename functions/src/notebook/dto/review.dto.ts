export class ReviewDto {
	readonly notebookId?: string;

	readonly message?: string;

	readonly rating: number;

	readonly displayName?: string;

	readonly userId?: string;

	readonly profileUrl?: string;
}
