import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Response } from '../interfaces/response.interface';
import { Review } from '../interfaces/review.interface';
import { AddNotebookReview } from '../dto/addNotebookReview';
import { RemoveReviewDto } from '../dto/removeReview.dto';

@Injectable()
export class ReviewService {
	async addNotebookReview(addNotebookReview: AddNotebookReview, userId: string): Promise<Response> {
		const timestamp = Date.now();

		return admin
			.firestore()
			.collection('notebookReviews')
			.add({
				...addNotebookReview,
				userId,
				timestamp,
			})
			.then(() => ({
				message: 'Successfully added a review!',
			}))
			.catch((error) => {
				throw new HttpException(`Could not add notebook review. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	async getNotebookReviews(notebookId: string): Promise<Review[]> {
		const reviews = [];

		try {
			const snapshot = await admin
				.firestore()
				.collection('notebookReviews')
				.where('notebookId', '==', notebookId)
				.get();

			snapshot.forEach((doc) => {
				reviews.push({
					message: doc.data().message,
					rating: doc.data().rating,
					displayName: doc.data().displayName,
					userId: doc.data().userId,
					profileUrl: doc.data().profileUrl,
					timestamp: doc.data().timestamp,
					notebookId: doc.data().notebookId,
				});
			});

			return reviews;
		} catch (error) {
			throw new HttpException(`Could not retrieve notebook reviews${error}`, HttpStatus.BAD_REQUEST);
		}
	}

	async deleteNotebookReview(removeReviewDto: RemoveReviewDto): Promise<Response> {
		// TODO ADD AUTH
		let removeDocId: string | null = null;

		const accessSnapshot = await admin
			.firestore()
			.collection('notebookReviews')
			.where('notebookId', '==', removeReviewDto.notebookId)
			.get()
			.catch((error) => {
				throw new HttpException(`Was unable to remove users review. ${error}`, HttpStatus.BAD_REQUEST);
			});

		accessSnapshot.forEach((accessUser) => {
			if (accessUser.data().userId === removeReviewDto.userId) {
				removeDocId = accessUser.id;
			}
		});

		return admin
			.firestore()
			.collection('notebookReviews')
			.doc(removeDocId)
			.delete()
			.then(() => ({
				message: "Successfully removed user's review.",
			}))
			.catch((error) => {
				throw new HttpException(`Was unable to remove users review. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}
}
