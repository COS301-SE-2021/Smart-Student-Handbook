import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Response } from '../interfaces/response.interface';
import { Access } from '../interfaces/access.interface';
import { AddAccessDto } from '../dto/addAccess.dto';
import { RemoveUserAccessDto } from '../dto/removeUserAccess.dto';

@Injectable()
export class AccessService {
	/**
	 * Returns a list of users that can access the notebook
	 * @param notebookId
	 */
	async getAccessList(notebookId: string): Promise<Access[]> {
		const accessList: Access[] = [];

		/**
		 * Get all users that have access to the specified notebook
		 */
		const accessSnapshot = await admin
			.firestore()
			.collection('notebookAccess')
			.where('notebookId', '==', notebookId)
			.orderBy('displayName')
			.get();

		/**
		 * Add each user into the access array and return the access array
		 */
		accessSnapshot.forEach((accessUser) => {
			accessList.push(<Access>accessUser.data());
		});

		return accessList;
	}

	/**
	 * Add a notebook reference to a users account on firebase
	 * @param addAccessDto
	 * @param userId
	 */
	async addAccess(addAccessDto: AddAccessDto, userId: string): Promise<Response> {
		const accessId: string = randomStringGenerator();
		/**
		 * Check to see if user is the creator of the notebook
		 */
		if (!(await this.checkCreator(addAccessDto.notebookId, userId))) {
			throw new HttpException('User is not authorized to add user access to notebook.', HttpStatus.UNAUTHORIZED);
		}
		/**
		 * Return success message if notebook was successfully added else throw exception
		 */
		await admin
			.firestore()
			.collection('notebookAccess')
			.doc(accessId)
			.set({ ...addAccessDto, accessId });

		await this.updateNotebookAccess(addAccessDto.notebookId);

		return {
			message: 'Successfully added notebook to user account',
		};
	}

	/**
	 * Remove a user for having access to the specified notebook
	 * @param removeUserAccessDto
	 * @param userId
	 */
	async removeUserAccess(removeUserAccessDto: RemoveUserAccessDto, userId: string): Promise<Response> {
		/**
		 * Check to see if user is the creator of the notebook
		 */
		if (!(await this.checkCreator(removeUserAccessDto.notebookId, userId))) {
			throw new HttpException(
				'User is not authorized to remove user access to the specified notebook.',
				HttpStatus.UNAUTHORIZED,
			);
		}

		/**
		 * Remove the user from form having access to the notebook or throw an exception in the case of failure
		 */
		await admin
			.firestore()
			.collection('notebookAccess')
			.doc(removeUserAccessDto.accessId)
			.delete()
			.catch(() => {
				throw new HttpException(
					"Was unable to revoked the specified user's access to the current notebook.",
					HttpStatus.BAD_REQUEST,
				);
			});

		await this.updateNotebookAccess(removeUserAccessDto.notebookId);

		return {
			message: "Successfully revoked user's access to the current notebook",
		};
	}

	/**
	 * Check to see if a user has permission to access the specified notebook
	 * @param notebookId
	 * @param userId
	 */
	async checkUserAccess(notebookId: string, userId: string): Promise<boolean> {
		/**
		 * Get the list of all users that have access to the notebook
		 */
		const access: Access[] = await this.getAccessList(notebookId);
		let accessGranted = false;

		/**
		 * Search to see the user making the request is contained inside the list. If so change access status to true
		 */
		access.forEach((user: Access) => {
			if (user.userId === userId) {
				accessGranted = true;
			}
		});

		return accessGranted;
	}

	/**
	 * Check to see if the user making the request is the create of a the notebook
	 * @param notebookId
	 * @param userId
	 */
	async checkCreator(notebookId: string, userId: string): Promise<boolean> {
		/**
		 * Find the notebook by notebook id
		 */
		const doc = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

		/**
		 * Check of the notebook exists and if so is the created id equal to the user id making the request. If so
		 * return true else return false
		 */
		if (doc.exists) {
			if (doc.data().creatorId === userId) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Update the content of a notebook
	 * @param notebookId
	 */
	async updateNotebookAccess(notebookId: string): Promise<void> {
		const access = await this.getAccessList(notebookId);
		/**
		 * Update notes in notebook on firebase.
		 */
		await admin.firestore().collection('userNotebooks').doc(notebookId).update({
			access,
		});
	}

	/**
	 * Check to see if a user has permission to access the specified notebook
	 * @param notebookId
	 * @param userId
	 */
	async getUserAccessId(notebookId: string, userId: string): Promise<string> {
		/**
		 * Get the list of all users that have access to the notebook
		 */
		const access: Access[] = await this.getAccessList(notebookId);
		let accessId = '';

		/**
		 * Search to see the user making the request is contained inside the list. If so change access status to true
		 */
		access.forEach((user: Access) => {
			if (user.userId === userId) {
				accessId = user.accessId;
			}
		});

		return accessId;
	}
}
