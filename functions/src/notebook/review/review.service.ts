import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Response } from '../interfaces/response.interface';
import { Review } from '../interfaces/review.interface';
import { AddNotebookReview } from '../dto/addNotebookReview';

@Injectable()
export class ReviewService {
	async addNotebookReview(addNotebookReview: AddNotebookReview, userId: string): Promise<Response> {
		const reviewId = randomStringGenerator();
		const timestamp = Date.now();

		return admin
			.firestore()
			.collection('notebookReviews')
			.doc(reviewId)
			.set({
				...addNotebookReview,
				userId,
				timestamp,
				reviewId,
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

			snapshot.forEach((review) => {
				reviews.push({
					...review.data(),
				});
			});

			return reviews;
		} catch (error) {
			throw new HttpException(`Could not retrieve notebook reviews${error}`, HttpStatus.BAD_REQUEST);
		}
	}

	async deleteNotebookReview(reviewId, userId: string): Promise<Response> {
		const review = await admin
			.firestore()
			.collection('notebookReviews')
			.doc(reviewId)
			.get()
			.then((doc) => doc.data())
			.catch((error) => {
				throw new HttpException(`Could not find notebook review. ${error}`, HttpStatus.BAD_REQUEST);
			});

		if (!(review.userId === userId)) {
			throw new HttpException('User does not have access to delete specified review.', HttpStatus.UNAUTHORIZED);
		}

		return await admin
			.firestore()
			.collection('notebookReviews')
			.doc(reviewId)
			.delete()
			.then(() => ({
				message: 'Successfully delete a review!',
			}))
			.catch((error) => {
				throw new HttpException(`Was unable to delete users review. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	async checkReviewCreator(notebookId: string, userId: string): Promise<boolean> {
		let creatorStatus = false;
		const reviewList: Review[] = await this.getNotebookReviews(notebookId);

		reviewList.forEach((review) => {
			if (review.userId === userId) {
				creatorStatus = true;
			}
		});

		return creatorStatus;
	}
}
