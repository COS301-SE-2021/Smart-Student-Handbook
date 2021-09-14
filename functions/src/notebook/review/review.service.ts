import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Response } from '../interfaces/response.interface';
import { Review } from '../interfaces/review.interface';
import { AddNotebookReviewDto } from '../dto/addNotebookReview.dto';
import { AddNoteReviewDto } from '../dto/AddNoteReview.dto';

@Injectable()
export class ReviewService {
	async addNotebookReview(addNotebookReview: AddNotebookReviewDto, userId: string): Promise<Response> {
		const timestamp = Date.now();

		/**
		 * Combined userId and notebookId to ensure there are no duplicate review for the same user on a notebook
		 */
		const notebookId = addNotebookReview.notebookId.substr(0, 18);
		const reviewId = [notebookId.slice(0, 14), userId.substr(0, 14), notebookId.slice(14)].join('');

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

		const snapshot = await admin
			.firestore()
			.collection('notebookReviews')
			.where('notebookId', '==', notebookId)
			.orderBy('timestamp')
			.get();

		snapshot.forEach((review) => {
			reviews.push({
				...review.data(),
			});
		});

		return reviews;
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

	async addNoteReview(addNotebookReview: AddNoteReviewDto, userId: string): Promise<Response> {
		const timestamp = Date.now();

		/**
		 * Combined userId and notebookId to ensure there are no duplicate review for the same user on a notebook
		 */
		const noteId = addNotebookReview.noteId.substr(0, 18);
		const reviewId = [noteId.slice(0, 14), userId.substr(0, 14), noteId.slice(14)].join('');

		return admin
			.firestore()
			.collection('noteReviews')
			.doc(reviewId)
			.set({
				...addNotebookReview,
				userId,
				timestamp,
				reviewId,
			})
			.then(() => ({
				message: 'Successfully added a review to a note!',
			}))
			.catch((error) => {
				throw new HttpException(`Could not add note review. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	async getNoteReviews(noteId: string): Promise<Review[]> {
		const reviews = [];

		try {
			const snapshot = await admin.firestore().collection('noteReviews').where('noteId', '==', noteId).get();

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

	async deleteNoteReview(reviewId, userId: string): Promise<Response> {
		const review = await admin
			.firestore()
			.collection('noteReviews')
			.doc(reviewId)
			.get()
			.then((doc) => doc.data())
			.catch((error) => {
				throw new HttpException(`Could not find note review. ${error}`, HttpStatus.BAD_REQUEST);
			});

		if (!(review.userId === userId)) {
			throw new HttpException(
				'User does not have access to delete specified review relating to this note.',
				HttpStatus.UNAUTHORIZED,
			);
		}

		return await admin
			.firestore()
			.collection('noteReviews')
			.doc(reviewId)
			.delete()
			.then(() => ({
				message: 'Successfully delete a note review!',
			}))
			.catch((error) => {
				throw new HttpException(`Was unable to delete user's note review. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}
}
