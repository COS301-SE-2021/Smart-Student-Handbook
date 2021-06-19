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
			throw new HttpException('Bad Request '+'Error creating new user:', HttpStatus.BAD_REQUEST);
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
			throw new HttpException('Bad Request. User might not be signed in or does not exist.', HttpStatus.BAD_REQUEST);
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
			throw new HttpException('Error updating user: '+ error, HttpStatus.BAD_REQUEST);
		});
	}

	async loginUser(loginDto: LoginDto): Promise<Response>
	{
		return firebase.auth().signInWithEmailAndPassword(loginDto.email, loginDto.password).then((userCredential) => {
			return {
				message: "User is successfully logged in.",
			};
		})
		.catch((error) => {
			throw new HttpException('Bad Request '+error.message, HttpStatus.BAD_REQUEST);
		});
	}

	async signOut(): Promise<Response>
	{
		return firebase.auth().signOut().then(() => {
			return {
				message: "Successfully signed out."
			}
		}).catch((error) => {
			throw new HttpException('Internal Service Error '+error, HttpStatus.INTERNAL_SERVER_ERROR);
		});
	}

	async getCurrentUser(): Promise<Account>
	{
		const user = firebase.auth().currentUser;

		return {
			uid: user.uid,
			email: user.email,
			emailVerified: user.emailVerified,
			phoneNumber: user.phoneNumber,
			displayName: user.displayName
		};
	}

	async deleteUser(): Promise<Response>
	{
		let uid: string = firebase.auth().currentUser.uid;

		return admin.auth().deleteUser(uid).then(() => {
			return {
				message: "Successfully deleted user."
			};
		})
		.catch((error) => {
			throw new HttpException('Internal Service Error '+error, HttpStatus.INTERNAL_SERVER_ERROR);
		});
	}








}
