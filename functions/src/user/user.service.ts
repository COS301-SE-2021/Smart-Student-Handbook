import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserRequestDto } from './dto/userRequest.dto';
import { User, UserResponseDto } from './dto/userResponse.dto';
import { UserByUsernameDto } from './dto/userByUsername.dto';

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

		if (resp) {
			return { success: true, message: 'User was successfully added' };
		}
		throw new HttpException('An unexpected Error Occurred', HttpStatus.BAD_REQUEST);
	}

	/**
	 * Takes a userID as input searches for the specific user in the firestore database in the user collection
	 * once found the userProfile is deleted and a success message is returned
	 * if the user is not found an error message is thrown
	 * @param userID
	 */
	async createUser(user: UserRequestDto): Promise<UserResponseDto> {
		const exist = await this.doesUsernameExist(user.username);
		if (exist) {
			return {
				success: false,
				message: 'User unsuccessfully updated',
			};
		}
		return admin
			.firestore()
			.collection('users')
			.doc(user.uid)
			.set(user)
			.then(() => ({
				success: true,
				message: 'User successfully created',
			}))
			.catch(() => ({
				success: false,
				message: 'User unsuccessfully created',
			}));
	}

	async updateUser(user: UserRequestDto): Promise<UserResponseDto> {
		const exist = await this.doesUsernameExist(user.username);
		if (exist) {
			return {
				success: false,
				message: 'User unsuccessfully updated',
			};
		}

		const updates: { [key: string]: string } = {};

		if (user.username != null) {
			updates.name = user.username;
		}

		if (user.institution != null) {
			updates.institution = user.institution;
		}

		if (user.department != null) {
			updates.department = user.department;
		}

		if (user.program != null) {
			updates.program = user.program;
		}

		if (user.workStatus != null) {
			updates.workStatus = user.workStatus;
		}

		if (user.bio != null) {
			updates.bio = user.bio;
		}

		if (user.profilePicUrl != null) {
			updates.profilePicUrl = user.profilePicUrl;
		}

		return admin
			.firestore()
			.collection('users')
			.doc(user.uid)
			.update(updates)
			.then(() => ({
				success: true,
				message: 'User successfully updated',
			}))
			.catch(() => ({
				success: false,
				message: 'User unsuccessfully updated',
			}));
	}

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

	getUserByUsername(userByUsernameDto: UserByUsernameDto) {
		return admin
			.firestore()
			.collection('users')
			.where('username', '==', userByUsernameDto.username)
			.get()
			.then((querySnapshot) => ({
				success: true,
				message: 'User was successfully found',
				userInfo: {
					uid: querySnapshot.docs[0].data().uid,
					name: querySnapshot.docs[0].data().name,
					institution: querySnapshot.docs[0].data().institution,
					department: querySnapshot.docs[0].data().department,
					program: querySnapshot.docs[0].data().program,
					workStatus: querySnapshot.docs[0].data().workStatus,
					bio: querySnapshot.docs[0].data().bio,
					profilePicUrl: querySnapshot.docs[0].data().profilePicUrl,
					dateJoined: querySnapshot.docs[0].data().dateJoined,
				},
			}))
			.catch(() => ({
				success: false,
				message: 'User was not successfully found',
				userInfo: null,
			}));
	}

	async doesUsernameExist(username: string): Promise<boolean> {
		return admin
			.firestore()
			.collection('users')
			.where('username', '==', username)
			.get()
			.then(() => true)
			.catch(() => false);
	}
}
