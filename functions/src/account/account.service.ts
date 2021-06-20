import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response } from "./interfaces/response.interface";
import { Account } from "./interfaces/account.interface";
import firebase from 'firebase';
require('firebase/auth');
import * as admin from 'firebase-admin';


@Injectable()
export class AccountService {

	/**
	 * Register a new user
	 * @param registerDto
	 */
	async registerUser(registerDto: RegisterDto): Promise<Response>
	{
		//Check if user password and confirm passwords match before creating user
		if(registerDto.password != registerDto.passwordConfirm)
		{
			throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
		}

		/**
		 * Create user.
		 * If successful return success message else throw Bad Request exception
		 */
		return admin.auth().createUser({
			email: registerDto.email,
			emailVerified: false,
			phoneNumber: registerDto.phoneNumber,
			password: registerDto.password,
			displayName: registerDto.displayName,
			disabled: false,
		}).then((userRecord) => {
			// See the UserRecord reference doc for the contents of userRecord.
			return {
				message: "User is successfully registered!"
			};
		})
		.catch((error) => {
			throw new HttpException('Bad Request '+'Error creating new user: '+error.message, HttpStatus.BAD_REQUEST);
		});
	}

	/**
	 * Update user.
	 * If successful return success message else throw Bad Request exception
	 */
	async updateUser(registerDto: RegisterDto): Promise<Response>
	{
		let uid: string = "";

		//Check if user is logged in
		try{
			uid = firebase.auth().currentUser.uid;
		}
		catch(error) {
			throw new HttpException('Bad Request. User might not be signed in or does not exist: '+error.message, HttpStatus.BAD_REQUEST);
		}

		/**
		 * Try to update user. If successful return success message else throw error
		 */
		return admin.auth().updateUser(uid, {
			email: registerDto.email,
			emailVerified: false,
			phoneNumber: registerDto.phoneNumber,
			password: registerDto.password,
			displayName: registerDto.displayName,
			disabled: false,
		}).then((userRecord) =>
		{
			return {
				message: "User is successfully updated!"
			};
		})
		.catch((error) => {
			throw new HttpException('Error updating user: '+ error.message, HttpStatus.BAD_REQUEST);
		});
	}

	/**
	 * Login user.
	 */
	async loginUser(loginDto: LoginDto): Promise<Account>
	{
		// Login user. If successful return success message else throw Bad Request exception
		return firebase.auth().signInWithEmailAndPassword(loginDto.email, loginDto.password).then((userCredential) => {

			return {
				uid: userCredential.user.uid,
				email: userCredential.user.email,
				emailVerified: userCredential.user.emailVerified,
				phoneNumber: userCredential.user.phoneNumber,
				displayName: userCredential.user.displayName,
				message: "User is successfully logged in.",
			};
		})
		.catch((error) => {
			throw new HttpException('Bad Request '+ error.message, HttpStatus.BAD_REQUEST);
		});
	}

	/**
	 * SignOut user.
	 */
	async signOut(): Promise<Response>
	{
		// SignOut user. If successful return success message else throw Bad Request exception
		return firebase.auth().signOut().then(() => {
			return {
				message: "Successfully signed out."
			}
		}).catch((error) => {
			throw new HttpException('Internal Service Error: '+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		});
	}

	/**
	 * GetCurrent user.
	 */
	async getCurrentUser(): Promise<Account>
	{
		// Check if there is a current user else throw an exception
		let user;
		try{
			user = firebase.auth().currentUser;
			//Return user object

			return {
				uid: user.uid,
				email: user.email,
				emailVerified: user.emailVerified,
				phoneNumber: user.phoneNumber,
				displayName: user.displayName
			};
		}
		catch(error) {
			throw new HttpException('Bad Request. User might not be signed in or does not exist: '+error.message, HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * DeleteUser user.
	 */
	async deleteUser(): Promise<Response>
	{
		let uid: string = "";

		// Check if there is a current user else throw an exception
		try {
			uid = firebase.auth().currentUser.uid;

			//Try to delete user else throw and exception if not possible
			return admin.auth().deleteUser(uid).then(() => {
				return {
					message: "Successfully deleted user."
				};
			})
			.catch((error) => {
				throw new HttpException('Internal Service Error: '+error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			});
		}
		catch(error) {
			throw new HttpException('Bad Request. User might not be signed in or does not exist.'+error.message, HttpStatus.BAD_REQUEST);
		}
	}








}
