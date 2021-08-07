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
// import { EmailNotificationRequestDto } from '../notification/dto/emailNotificationRequest.dto';

// import { UserService } from '../user/user.service';

require('firebase/auth');

@Injectable()
export class AccountService {
	constructor(private notificationService: NotificationService) {}

	/**
	 * Register a new user
	 * @param registerDto
	 */
	async registerUser(registerDto: RegisterDto): Promise<Account> {
		// Check if user password and confirm passwords match before creating user
		if (registerDto.password !== registerDto.passwordConfirm) {
			throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
		}

		const actionCodeSettings = {
			// URL you want to redirect back to. The domain (www.example.com) for this
			// URL must be in the authorized domains list in the Firebase Console.
			url: 'https://smartstudentnotebook.web.app/home',
		};

		// send welcome email to new user
		await this.notificationService.sendEmailNotification({
			email: registerDto.email,
			subject: 'Welcome to Smart Student Handbook',
			body: `Good day, ${registerDto.displayName}. We are very exited to see all your amazing notebooks!!!`,
		});

		/**
		 * Create user.
		 * If successful return success message else throw Bad Request exception
		 */
		const resp = admin
			.auth()
			.createUser({
				email: registerDto.email,
				emailVerified: false,
				password: registerDto.password,
				displayName: registerDto.displayName,
				disabled: false,
			})
			.then(
				(userCredential): Account => ({
					uid: userCredential.uid,
					email: userCredential.email,
					emailVerified: userCredential.emailVerified,
					displayName: userCredential.displayName,
					message: 'User is successfully registered!',
				}),
			)
			.catch((error) => {
				// eslint-disable-next-line max-len
				throw new HttpException(`${'Bad Request Error creating new user: '}${error.message}`, HttpStatus.BAD_REQUEST);
			});

		admin
			.auth()
			.generateEmailVerificationLink(registerDto.email, actionCodeSettings)
			.then(async (link) => {
				await this.notificationService.sendEmailNotification({
					email: registerDto.email,
					subject: 'Smart Student Handbook Email Verification',
					body: `Good day, ${registerDto.displayName}. Please Verify your Email with this link: ${link}`,
				});
			})
			.catch((error) => {
				// eslint-disable-next-line max-len
				throw new HttpException(`${'Bad Request Verifying Email: '}${error.message}`, HttpStatus.BAD_REQUEST);
			});

		return resp;
	}

	/**
	 * Update user.
	 * If successful return success message else throw Bad Request exception
	 */
	async updateUser(registerDto: RegisterDto): Promise<Account> {
		let uid = '';

		// Check if user is logged in
		try {
			uid = firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException(
				`Bad Request. User might not be signed in or does not exist: ${error.message}`,
				HttpStatus.BAD_REQUEST,
			);
		}

		/**
		 * Try to update user. If successful return success message else throw error
		 */
		return admin
			.auth()
			.updateUser(uid, {
				email: registerDto.email,
				emailVerified: false,
				password: registerDto.password,
				displayName: registerDto.displayName,
				disabled: false,
			})
			.then((userCredential) => ({
				uid: userCredential.uid,
				email: userCredential.email,
				emailVerified: userCredential.emailVerified,
				displayName: userCredential.displayName,
				message: 'User is successfully updated!',
			}))
			.catch((error) => {
				throw new HttpException(`Error updating user: ${error.message}`, HttpStatus.BAD_REQUEST);
			});
	}

	/**
	 * Login user.
	 */
	async loginUser(loginDto: LoginDto): Promise<Account> {
		// Login user. If successful return success message else throw Bad Request exception
		return firebase
			.auth()
			.signInWithEmailAndPassword(loginDto.email, loginDto.password)
			.then((userCredential) => ({
				uid: userCredential.user.uid,
				email: userCredential.user.email,
				emailVerified: userCredential.user.emailVerified,
				phoneNumber: userCredential.user.phoneNumber,
				displayName: userCredential.user.displayName,
				message: 'User is successfully logged in.',
			}))
			.catch((error) => {
				throw new HttpException(`Bad Request ${error.message}`, HttpStatus.BAD_REQUEST);
			});
	}

	/**
	 * SignOut user.
	 */
	async signOut(): Promise<Response> {
		// SignOut user. If successful return success message else throw Bad Request exception
		return firebase
			.auth()
			.signOut()
			.then(() => ({
				message: 'Successfully signed out.',
			}))
			.catch((error) => {
				throw new HttpException(`Internal Service Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
			});
	}

	/**
	 * GetCurrent user.
	 */
	async getCurrentUser(): Promise<Account> {
		// Check if there is a current user else throw an exception
		let user;
		try {
			user = firebase.auth().currentUser;

			// Return user object
			return {
				uid: user.uid,
				email: user.email,
				emailVerified: user.emailVerified,
				displayName: user.displayName,
			};
		} catch (error) {
			throw new HttpException(
				`Bad Request. User might not be signed in or does not exist: ${error.message}`,
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	/**
	 * DeleteUser user.
	 */
	async deleteUser(): Promise<Response> {
		let uid = '';

		// Check if there is a current user else throw an exception
		try {
			uid = firebase.auth().currentUser.uid;

			// Try to delete user else throw and exception if not possible
			return await admin
				.auth()
				.deleteUser(uid)
				.then(() => ({
					message: 'Successfully deleted user.',
				}))
				.catch((error) => {
					// eslint-disable-next-line max-len
					throw new HttpException(`Internal Service Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
				});
		} catch (error) {
			throw new HttpException(
				`Bad Request. User might not be signed in or does not exist.${error.message}`,
				HttpStatus.BAD_REQUEST,
			);
		}
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
				throw new HttpException(`Bad Request. User does not exist: ${error.message}`, HttpStatus.BAD_REQUEST);
			});

		const host = '';
		const path = '';
		const { email } = userData;
		const encodedCode = this.encodeResetCode(userData.uid, userData.email);
		const link = 'https://';
		// eslint-disable-next-line max-len
		link.concat(host, path, '/', email, '/', String(resetPasswordDto.isLocahost), '/', encodedCode);

		await this.notificationService.sendEmailNotification({
			email: resetPasswordDto.email,
			subject: 'Smart Student Handbook Email Verification',
			// eslint-disable-next-line max-len
			body: `Good day, ${userData.displayName}. You request to change your password. \nPlease do so with this link: ${link}`,
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
			host = 'https://smartstudentnotebook.web.app/';
		}

		const codeInterface = this.decodeResetCode(code);

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

		return { url: `${host}/account/resetPassword?${code}` };
	}

	async finalizeResetPassword(resetPasswordFinalizeDto: ResetPasswordFinalizeDto) {
		const { email, code, newPassword } = resetPasswordFinalizeDto;

		// eslint-disable-next-line eqeqeq
		if (code == undefined || newPassword == undefined) {
			throw new HttpException('Bad Request. Not all parameters provided', HttpStatus.BAD_REQUEST);
		}

		const codeInterface = this.decodeResetCode(code);

		// eslint-disable-next-line eqeqeq
		if (codeInterface.timeExpire == 0 || codeInterface.uid == '' || codeInterface.email == '') {
			throw new HttpException('Bad Request. Invalid Code', HttpStatus.BAD_REQUEST);
		}

		const userData = await admin
			.auth()
			.getUserByEmail(email)
			.then((userRecord) => ({
				displayName: userRecord.displayName,
				uid: userRecord.uid,
			}))
			.catch((error) => {
				throw new HttpException(`Bad Request. User does not exist: ${error.message}`, HttpStatus.BAD_REQUEST);
			});

		// eslint-disable-next-line eqeqeq,max-len
		if (codeInterface.checksumPassed == false || codeInterface.email != email || codeInterface.uid != userData.uid) {
			throw new HttpException('Bad Request. Invalid Code', HttpStatus.BAD_REQUEST);
		}

		if (codeInterface.timeExpire < Date.now()) {
			throw new HttpException('Bad Request. Invalid Code', HttpStatus.BAD_REQUEST);
		}

		return admin
			.auth()
			.updateUser(userData.uid, {
				password: newPassword,
			})
			.then((userCredential) => ({
				uid: userCredential.uid,
				email: userCredential.email,
				emailVerified: userCredential.emailVerified,
				displayName: userCredential.displayName,
				message: 'User is successfully updated!',
			}))
			.catch((error) => {
				throw new HttpException(`Error updating user: ${error.message}`, HttpStatus.BAD_REQUEST);
			});
	}

	encodeResetCode(uid: string, email: string) {
		const timeExpire = Date.now() + 1800000;

		const randNum = '';
		let checkNum = 0;
		for (let i = 0; i < 7; i += 1) {
			const num = Math.floor(Math.random() * 10);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			checkNum += num;
			randNum.concat(num.toString());
		}

		const code: string = timeExpire.toString();
		code.concat(
			'.',
			uid.substr(0, 8),
			'.',
			email,
			'.',
			randNum,
			checkNum.toString().charAt(checkNum.toString().length - 1),
		);

		return btoa(code);
	}

	decodeResetCode(code: string) {
		const decodedCode = atob(code);
		const codeSplit = decodedCode.split('.');

		// eslint-disable-next-line eqeqeq
		if (codeSplit.length != 3) {
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
			email: codeSplit[2],
			checksum: Number(codeSplit[3]),
			checksumPassed: checkPassed,
		};
	}
}
