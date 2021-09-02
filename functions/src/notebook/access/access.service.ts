import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Response } from '../interfaces/response.interface';
import { Access } from '../interfaces/access.interface';
import { AddAccessDto } from '../dto/addAccess.dto';
import { RemoveUserAccessDto } from '../dto/removeUserAccess.dto';

@Injectable()
export class AccessService {
	async getAccessList(notebookId: string): Promise<Access[]> {
		const accessList: Access[] = [];

		const accessSnapshot = await admin
			.firestore()
			.collection('notebookAccess')
			.where('notebookId', '==', notebookId)
			.get();

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
		// TODO ADD AUTH
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

	async removeUserAccess(removeUserAccessDto: RemoveUserAccessDto): Promise<Response> {
		// TODO ADD AUTH
		let removeDocId: string | null = null;

		const accessSnapshot = await admin
			.firestore()
			.collection('notebookAccess')
			.where('notebookId', '==', removeUserAccessDto.notebookId)
			.get();

		accessSnapshot.forEach((accessUser) => {
			if (accessUser.data().userId === removeUserAccessDto.userId) {
				removeDocId = accessUser.id;
			}
		});

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

	async checkUserAccess(notebookId: string, userId: string): Promise<boolean> {
		const access: Access[] = await this.getAccessList(notebookId);
		let accessGranted = false;

		access.forEach((user: Access) => {
			if (user.userId === userId) {
				accessGranted = true;
			}
		});

		return accessGranted;
	}

	async checkCreator(notebookId: string, userId: string): Promise<boolean> {
		const doc = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

		if (doc.exists) {
			if (doc.data().creatorId === userId) {
				return true;
			}
		}
		return false;
	}
}
