import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetPasswordCodeDto } from './dto/resetPasswordCode.dto';
import { ResetPasswordFinalizeDto } from './dto/resetPasswordFinalize.dto';
import { Response } from './interfaces/response.interface';
import { Account } from './interfaces/account.interface';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { UpdateDto } from './dto/update.dto';
import { AuthService } from '../auth/auth.service';

require('firebase/auth');

@Injectable()
export class AccountService {
	constructor(
		private notificationService: NotificationService,
		private userService: UserService,
		private authService: AuthService,
	) {}

	/**
	 * Register a new user
	 * @param registerDto
	 */
	async registerUser(registerDto: RegisterDto): Promise<Account> {
		// Check if user password and confirm passwords match before creating user
		if (!(registerDto.password === registerDto.passwordConfirm)) {
			return {
				success: false,
				user: null,
				message: 'User is unsuccessfully registered:',
				error: 'Passwords dont match',
			};
		}
		// eslint-disable-next-line
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

		if (!emailRegex.test(registerDto.email) || !passwordRegex.test(registerDto.password)) {
			return {
				success: false,
				user: null,
				message: 'User is unsuccessfully registered:',
				error: 'Email or Password does not meet the requirements',
			};
		}

		const exist = await this.userService.doesUsernameExist(registerDto.username);
		if (exist === true) {
			return {
				success: false,
				user: null,
				message: 'User is unsuccessfully registered',
				error: 'Username already exists!!',
			};
		}

		/**
		 * Create user.
		 * If successful return success message else throw Bad Request exception
		 */
		const resp = await admin
			.auth()
			.createUser({
				email: registerDto.email,
				emailVerified: false,
				password: registerDto.password,
				displayName: registerDto.username,
				disabled: false,
			})
			.then(
				(userCredential): Account => ({
					success: true,
					user: {
						uid: userCredential.uid,
						email: userCredential.email,
						emailVerified: userCredential.emailVerified,
						displayName: userCredential.displayName,
						profilePicUrl:
							// eslint-disable-next-line max-len
							'https://storage.googleapis.com/smartstudentnotebook.appspot.com/UserProfilePictures/default.jpg',
					},
					message: 'User is successfully registered!',
				}),
			)
			.catch((error) => ({
				success: false,
				user: null,
				message: 'User is unsuccessfully registered!',
				error: error.message,
			}));

		// eslint-disable-next-line eqeqeq
		if (resp.success == false) {
			return resp;
		}

		const userCreated = await this.userService.createUser(
			{
				uid: resp.user.uid,
				username: resp.user.displayName,
				institution: 'Unknown',
				department: '',
				program: '',
				workStatus: '',
				bio: '',
				profilePicUrl:
					// eslint-disable-next-line max-len
					'https://storage.googleapis.com/smartstudentnotebook.appspot.com/UserProfilePictures/default.jpg',
				dateJoined: admin.firestore.FieldValue.serverTimestamp(),
			},
			resp.user.uid,
		);

		// eslint-disable-next-line eqeqeq
		if (userCreated.success == false) {
			return {
				success: false,
				user: null,
				message: 'User is unsuccessfully registered:',
				error: 'Some error have occured!',
			};
		}

		await this.notificationService.sendEmailNotification({
			email: registerDto.email,
			subject: 'Welcome to Smart Student Handbook',
			// eslint-disable-next-line max-len
			body: `Good day, ${registerDto.username}. \nWe are very exited to see all your amazing notebooks!!!`,
		});

		// send welcome email to new user
		return resp;
	}

	/**
	 * Update user.
	 * If successful return success message else throw Bad Request exception
	 */
	async updateUser(updateDto: UpdateDto, uid: string): Promise<Account> {
		// Check if user is logged in
		// try {
		// 	uid = firebase.auth().currentUser.uid;
		// } catch (error) {
		// 	return {
		// 		success: false,
		// 		user: null,
		// 		message: 'User does not exist',
		// 		error: error.message,
		// 	};
		// }

		const userDetails = {
			uid,
			institution: updateDto.institution,
			department: updateDto.department,
			program: updateDto.program,
			workStatus: updateDto.workStatus,
			bio: updateDto.bio,
			profilePicUrl: updateDto.profilePicUrl,
		};

		const updated = await this.userService.updateUser(userDetails, uid);

		// eslint-disable-next-line eqeqeq
		if (updated.success == false) {
			return {
				success: false,
				user: null,
				message: 'User does not exist',
				error: 'something went wrong along the way',
			};
		}

		const userRef = admin.firestore().collection('users').doc(uid);
		const doc = await userRef.get();

		/**
		 * Try to update user. If successful return success message else throw error
		 */
		return admin
			.auth()
			.updateUser(uid, {
				email: updateDto.email,
				emailVerified: false,
				password: updateDto.password,
				displayName: updateDto.displayName,
				disabled: false,
			})
			.then((userCredential) => ({
				success: true,
				user: {
					uid: userCredential.uid,
					email: userCredential.email,
					emailVerified: userCredential.emailVerified,
					displayName: userCredential.displayName,
					username: doc.data().username,
					institution: doc.data().institution,
					department: doc.data().department,
					program: doc.data().program,
					workStatus: doc.data().workStatus,
					bio: doc.data().bio,
					profilePic: doc.data().profilePicUrl,
					dateJoined: doc.data().dateJoined,
				},
				message: 'User is successfully Updated!',
			}))
			.catch((error) => ({
				success: false,
				user: null,
				message: 'Something went wrong, user was not updated!',
				error: `${error.message}`,
			}));
	}

	/**
	 * Login user.
	 */
	async loginUser(loginDto: LoginDto): Promise<Account> {
		try {
			// eslint-disable-next-line
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,40}$/;
			let authToken = '';

			if (!emailRegex.test(loginDto.email) || !passwordRegex.test(loginDto.password)) {
				return {
					success: false,
					user: null,
					message: 'Login failed, please try again!',
					error: 'Email or Password does not meet the requirements',
				};
			}
			const userData = await admin
				.auth()
				.getUserByEmail(loginDto.email)
				.then((userRecord) => ({
					uid: userRecord.uid,
				}))
				.catch(() => ({
					uid: null,
				}));

			const userRef = admin.firestore().collection('users').doc(userData.uid);
			const doc = await userRef.get();

			await firebase.auth().signInWithEmailAndPassword(loginDto.email, loginDto.password);

			await firebase
				.auth()
				.currentUser.getIdToken(true)
				.then((idToken) => {
					if (idToken) {
						authToken = idToken;
					}
				})
				.catch((error) => {
					throw new HttpException(`Could not get user token. ${error}`, HttpStatus.BAD_REQUEST);
				});

			// Login user. If successful return success message else throw Bad Request exception
			return firebase
				.auth()
				.signInWithEmailAndPassword(loginDto.email, loginDto.password)
				.then((userCredential) => ({
					success: true,
					user: {
						uid: userCredential.user.uid,
						email: userCredential.user.email,
						emailVerified: userCredential.user.emailVerified,
						displayName: userCredential.user.displayName,
						username: doc.data().username,
						institution: doc.data().institution,
						department: doc.data().department,
						program: doc.data().program,
						workStatus: doc.data().workStatus,
						bio: doc.data().bio,
						profilePic: doc.data().profilePicUrl,
						dateJoined: doc.data().dateJoined,
					},
					message: 'User is successfully logged in!',
					authToken,
				}))
				.catch((error) => ({
					success: false,
					user: null,
					message: 'Login failed, please try again!',
					error: error.message,
				}));
		} catch (error) {
			return {
				success: false,
				user: null,
				message: 'Login failed, please try again!',
				error: '',
			};
		}
	}

	/**
	 * SignOut user.
	 */
	async signOut(): Promise<Response> {
		// SignOut user. If successful return success message else throw Bad Request exception

		// return firebase
		// 	.auth()
		// 	.signOut()
		// 	.then(() => ({
		// 		message: 'Successfully signed out.',
		// 	}))
		// 	.catch((error) => ({
		// 		message: `${error.message}`,
		// 	}));
		return {
			message: 'Successfully signed out.',
		};
	}

	/**
	 * GetCurrent user.
	 */
	async getCurrentUser(userId: string): Promise<Account> {
		try {
			const user = await admin.auth().getUser(userId);

			const userRef = admin.firestore().collection('users').doc(user.uid);
			const doc = await userRef.get();

			return {
				success: true,
				user: {
					uid: user.uid,
					email: user.email,
					emailVerified: user.emailVerified,
					displayName: user.displayName,
					username: doc.data().username,
					institution: doc.data().institution,
					department: doc.data().department,
					program: doc.data().program,
					workStatus: doc.data().workStatus,
					bio: doc.data().bio,
					profilePicUrl: doc.data().profilePicUrl,
					dateJoined: doc.data().dateJoined,
				},
				message: 'User is successfully logged in.',
			};
		} catch (error) {
			return {
				success: false,
				user: null,
				message: 'User is not logged in.',
				error: error.message,
			};
		}
	}

	/**
	 * DeleteUser user.
	 */
	async deleteUser(uid: string): Promise<Response> {
		// Check if there is a current user else throw an exception
		try {
			await this.userService.deleteUserProfile(uid);
			// TODO delete all the users notebooks !!

			await admin.firestore().collection('users').doc(uid).delete();

			// Try to delete user else throw and exception if not possible
			return await admin
				.auth()
				.deleteUser(uid)
				.then(() => ({
					message: 'Successfully deleted user!',
				}))
				.catch((error) => ({
					message: error.message,
				}));
		} catch (error) {
			throw new HttpException(
				`Bad Request. User might not be signed in or does not exist.${error.message}`,
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	async verifyEmail(verifyEmailDto: VerifyEmailDto) {
		const userData = await admin
			.auth()
			.getUserByEmail(verifyEmailDto.email)
			.then((userRecord) => ({
				email: userRecord.email,
				uid: userRecord.uid,
			}))
			.catch(() => ({
				email: null,
				uid: null,
			}));

		if (userData.uid == null) {
			return {
				success: false,
				user: null,
				message: 'User is unsuccessfully logged in.',
				error: 'User does not exist',
			};
		}

		let host;
		// eslint-disable-next-line eqeqeq
		if (verifyEmailDto.local == 'true') {
			host = 'localhost:5000';
		} else {
			host = 'smartstudenthandbook.co.za';
		}

		const codeInterface = this.decodeSecureCode(verifyEmailDto.code);

		// eslint-disable-next-line eqeqeq
		if (codeInterface.timeExpire == 0 || codeInterface.uid == '' || codeInterface.email == '') {
			return { url: `${host}` };
		}

		const uid = userData.uid.substr(0, 8);

		// eslint-disable-next-line eqeqeq,max-len
		if (codeInterface.checksumPassed == false || codeInterface.email != userData.email || codeInterface.uid != uid) {
			return { url: `${host}` };
		}

		if (codeInterface.timeExpire < Date.now()) {
			return { url: `${host}` };
		}

		return admin
			.auth()
			.updateUser(userData.uid, {
				emailVerified: true,
			})
			.then(() => ({
				url: `${host}`,
			}))
			.catch(() => ({
				url: `${host}`,
			}));
	}

	async requestResetPassword(resetPasswordDto: ResetPasswordDto): Promise<Response> {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const userData = await admin
			.auth()
			.getUserByEmail(resetPasswordDto.email)
			.then((userRecord) => ({
				displayName: userRecord.displayName,
				uid: userRecord.uid,
				email: userRecord.email,
			}))
			.catch((error) => {
				throw new HttpException(`Bad Request. User does not exist: ${error}`, HttpStatus.BAD_REQUEST);
			});

		let host;
		// eslint-disable-next-line eqeqeq
		if (resetPasswordDto.isLocalhost == true) {
			host = 'localhost:5000';
		} else {
			host = 'smartstudenthandbook.co.za';
		}

		const { email } = userData;
		const encodedCode = this.encodeSecureCode(userData.uid, userData.email);

		await this.notificationService.sendEmailNotification({
			email: resetPasswordDto.email,
			subject: 'Smart Student Handbook Password Reset',
			// eslint-disable-next-line max-len
			body: `Good day, ${userData.displayName}. You requested to change your password. \nPlease do so with this link: \n http://${host}/account/resetPassword/${email}/${encodedCode}`,
		});

		return { message: `Request Send to ${resetPasswordDto.email}` };
	}

	async checkResetPassword(resetPasswordCodeDto: ResetPasswordCodeDto): Promise<{ url: string }> {
		const { email, code, local } = resetPasswordCodeDto;

		let host;
		// eslint-disable-next-line eqeqeq
		if (local == 'true') {
			host = 'localhost:5000';
		} else {
			host = 'smartstudenthandbook.co.za';
		}

		const codeInterface = this.decodeSecureCode(code);

		// eslint-disable-next-line eqeqeq
		if (codeInterface.timeExpire == 0 || codeInterface.uid == '' || codeInterface.email == '') {
			return { url: `${host}` };
		}

		const userData = await admin
			.auth()
			.getUserByEmail(email)
			.then((userRecord) => ({
				uid: userRecord.uid,
			}))
			.catch((error) => {
				throw new HttpException(`Bad Request. User does not exist: ${error.message}`, HttpStatus.BAD_REQUEST);
			});

		const uid = userData.uid.substr(0, 8);

		// eslint-disable-next-line eqeqeq
		if (codeInterface.checksumPassed == false || codeInterface.email != email || codeInterface.uid != uid) {
			return { url: `${host}` };
		}

		if (codeInterface.timeExpire < Date.now()) {
			return { url: `${host}` };
		}

		return { url: `http://${host}/account/resetPassword/${email}/${code}` };
	}

	async finalizeResetPassword(resetPasswordFinalizeDto: ResetPasswordFinalizeDto): Promise<Account> {
		const { email, code, newPassword } = resetPasswordFinalizeDto;

		// eslint-disable-next-line
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

		if (!passwordRegex.test(newPassword)) {
			return {
				success: false,
				user: null,
				message: 'User is unsuccessfully registered:',
				error: 'Email or Password does not meet the requirements',
			};
		}

		// eslint-disable-next-line eqeqeq
		if (code == undefined || newPassword == undefined) {
			return {
				success: false,
				user: null,
				message: 'Password is not updated!',
				error: 'Bad Request',
			};
		}

		const codeInterface = this.decodeSecureCode(code);

		// eslint-disable-next-line eqeqeq
		if (codeInterface.timeExpire == 0 || codeInterface.uid == '' || codeInterface.email == '') {
			return {
				success: false,
				user: null,
				message: 'Password is not updated! Invalid Code',
				error: 'Bad Request',
			};
		}

		const userData = await admin
			.auth()
			.getUserByEmail(email)
			.then((userRecord) => ({
				displayName: userRecord.displayName,
				uid: userRecord.uid,
			}))
			.catch(() => ({
				displayName: null,
				uid: null,
			}));

		if (userData.uid == null) {
			return {
				success: false,
				user: null,
				message: 'Password is not updated!',
				error: 'Bad Request',
			};
		}

		const uid = userData.uid.substr(0, 8);
		// eslint-disable-next-line eqeqeq,max-len
		if (codeInterface.checksumPassed == false || codeInterface.email != email || codeInterface.uid != uid) {
			return {
				success: false,
				user: null,
				message: 'Password is not updated!',
				error: 'Bad Request',
			};
		}

		if (codeInterface.timeExpire < Date.now()) {
			return {
				success: false,
				user: null,
				message: 'Password is not updated!',
				error: 'Bad Request',
			};
		}

		return admin
			.auth()
			.updateUser(userData.uid, {
				password: newPassword,
			})
			.then((userCredential) => ({
				success: true,
				user: {
					uid: userCredential.uid,
					email: userCredential.email,
					emailVerified: userCredential.emailVerified,
					displayName: userCredential.displayName,
				},
				message: 'Password is updated!',
			}))
			.catch((error) => ({
				success: false,
				user: null,
				message: 'Password is not updated!',
				error: error.message,
			}));
	}

	encodeSecureCode(uid: string, email: string) {
		const timeExpire = Date.now() + 1800000;

		let randNum = '';
		let checkNum = 0;
		for (let i = 0; i < 7; i += 1) {
			const num = Math.floor(Math.random() * 10);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			checkNum += num;
			randNum = randNum.concat(num.toString());
		}

		let code: string = timeExpire.toString();
		code = code.concat(
			'...',
			uid.substr(0, 8),
			'...',
			email,
			'...',
			randNum,
			checkNum.toString().charAt(checkNum.toString().length - 1),
		);

		return Buffer.from(code).toString('base64');
	}

	decodeSecureCode(code: string) {
		const decodedCode = Buffer.from(code, 'base64').toString();

		const codeSplit = decodedCode.split('...');
		// eslint-disable-next-line eqeqeq
		if (codeSplit.length != 4) {
			return {
				timeExpire: 0,
				uid: '',
				email: '',
				checksum: 0,
				checksumPassed: false,
			};
		}

		let checkSum = 0;
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < 7; i++) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			checkSum += Number(codeSplit[3].charAt(i));
		}
		const checkNum = checkSum.toString().charAt(checkSum.toString().length - 1);
		let checkPassed = false;
		// eslint-disable-next-line eqeqeq
		if (checkNum == codeSplit[3].charAt(7)) {
			checkPassed = true;
		}

		return {
			timeExpire: Number(codeSplit[0]),
			uid: codeSplit[1],
			email: `${codeSplit[2]}`,
			checksum: Number(codeSplit[3]),
			checksumPassed: checkPassed,
		};
	}

	async setUserNotificationToken(userId: string, notificationID: string): Promise<Response> {
		return admin
			.firestore()
			.collection('users')
			.doc(userId)
			.update({
				notificationId: notificationID,
			})
			.then(() => ({
				message: 'Successfully set the notificationID.',
			}));
	}

	async getUserNotificationID(userId: string): Promise<string> {
		try {
			const notificationId = await admin.firestore().collection('users').doc(userId).get();

			return notificationId.data().notificationID.value;
		} catch (error) {
			throw new HttpException(
				`Something went wrong. Operation could not be executed.${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
