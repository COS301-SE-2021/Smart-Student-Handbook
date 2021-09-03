import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
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
		/**
		 * Check to see if user is the creator of the notebook
		 */
		if (!(await this.checkCreator(addAccessDto.notebookId, userId))) {
			throw new HttpException('User is not authorized to add user access to notebook.', HttpStatus.UNAUTHORIZED);
		}
		/**
		 * Return success message if notebook was successfully added else throw exception
		 */
		return admin
			.firestore()
			.collection('notebookAccess')
			.add({ ...addAccessDto, userId })
			.then(() => ({
				message: 'Successfully added notebook to user account',
			}))
			.catch((error) => {
				throw new HttpException(error, HttpStatus.BAD_REQUEST);
			});
	}

	/**
	 * Remove a user for having access to the specified notebook
	 * @param removeUserAccessDto
	 * @param userId
	 */
	async removeUserAccess(removeUserAccessDto: RemoveUserAccessDto, userId: string): Promise<Response> {
		let removeDocId: string | null = null;

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
		 * Get all users that have access to the specified notebook
		 */
		const accessSnapshot = await admin
			.firestore()
			.collection('notebookAccess')
			.where('notebookId', '==', removeUserAccessDto.notebookId)
			.get();

		/**
		 * Search for the doc id of the user to be removed
		 */
		accessSnapshot.forEach((accessUser) => {
			if (accessUser.data().userId === removeUserAccessDto.userId) {
				removeDocId = accessUser.id;
			}
		});

		/**
		 * Remove the user from form having access to the notebook or throw an exception in the case of failure
		 */
		return admin
			.firestore()
			.collection('notebookAccess')
			.doc(removeDocId)
			.delete()
			.then(() => ({
				message: "Successfully revoked user's access to the current notebook",
			}))
			.catch((error) => {
				throw new HttpException(
					`Was unable to revoked the specified user's access to the current notebook. ${error}`,
					HttpStatus.BAD_REQUEST,
				);
			});
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
}
