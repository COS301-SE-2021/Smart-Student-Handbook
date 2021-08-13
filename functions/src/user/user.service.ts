import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import firebase from 'firebase/app';
import { UserRequestDto } from './dto/userRequest.dto';
import { User, UserResponseDto } from './dto/userResponse.dto';

@Injectable()
export class UserService {
	/**
	 * Queries firestore for the appropriate document in the user collection
	 * that contains that uid and returns it as a json object
	 * @param uid
	 */
	async getUserDetails(uid: string): Promise<UserResponseDto> {
		let requestedUser: User;
		const userRef = admin.firestore().collection('users').doc(uid);
		const doc = await userRef.get();

		if (doc.exists) {
			requestedUser = {
				uid,
				name: doc.data().name,
				institution: doc.data().institution,
				department: doc.data().department,
				program: doc.data().program,
				workStatus: doc.data().workStatus,
				bio: doc.data().bio,
				profilePicUrl: doc.data().profilePicUrl,
				dateJoined: doc.data().dateJoined,
			};
		} else {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}

		return {
			success: true,
			message: 'User was successfully found',
			userInfo: requestedUser,
		};
	}

	/**
	 * Sends a user profile object to firestore where it then creates a new document in the
	 * users collection with the user object tha is passed through
	 * This function acts as both a update and create, firestore will take
	 * care of the rest and update or create a new record
	 * @param user
	 * @param update
	 */
	async createAndUpdateUser(
		user: UserRequestDto,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		update = false,
	): Promise<UserResponseDto> {
		const resp = await admin.firestore().collection('users').doc(user.uid).set(user);

		if (resp) return { success: true, message: 'User was successfully added' };
		throw new HttpException('An unexpected Error Occurred', HttpStatus.BAD_REQUEST);
	}

	/**
	 * Takes a userID as input searches for the specific user in the firestore database in the user collection
	 * once found the userProfile is deleted and a success message is returned
	 * if the user is not found an error message is thrown
	 * @param userID
	 */
	async deleteUserProfile(userId): Promise<UserResponseDto> {
		return admin
			.firestore()
			.collection('users')
			.doc(userId)
			.delete()
			.then(() => ({
				success: true,
				message: 'User profile was successfully deleted',
			}))
			.catch(() => {
				throw new HttpException('An unexpected Error Occurred', HttpStatus.BAD_REQUEST);
			});
	}
}
