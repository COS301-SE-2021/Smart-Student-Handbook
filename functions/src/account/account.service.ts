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

	async registerUser(registerDto: RegisterDto): Promise<Response>
	{
		if(registerDto.password !== registerDto.passwordConfirm)
		{
			throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
		}

		admin.auth().createUser({
			email: registerDto.email,
			emailVerified: false,
			phoneNumber: registerDto.phoneNumber,
			password: registerDto.password,
			displayName: registerDto.displayName,
			disabled: false,
		}).then((userRecord) => {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log('Successfully created new user:', userRecord.uid);
		})
		.catch((error) => {
			throw new HttpException('Bad Request '+'Error creating new user:', error);
		});

		return {
			message: "User is successfully registered!"
		};
	}

	async updateUser(registerDto: RegisterDto): Promise<Response>
	{
		let uid: string = firebase.auth().currentUser.uid;

		if(registerDto.password !== registerDto.passwordConfirm)
		{
			throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
		}

		admin.auth().updateUser(uid, {
			email: registerDto.email,
			emailVerified: false,
			phoneNumber: registerDto.phoneNumber,
			password: registerDto.password,
			displayName: registerDto.displayName,
			disabled: false,
		}).then((userRecord) =>
		{
			// See the UserRecord reference doc for the contents of userRecord.
			console.log('Successfully updated user', userRecord.toJSON());
		})
		.catch((error) => {
			console.log('Error updating user:', error);
		});

		return {
			message: "User is successfully updated!"
		};

	}

	async loginUser(loginDto: LoginDto): Promise<Response>
	{
		firebase.auth().signInWithEmailAndPassword(loginDto.email, loginDto.password).then((userCredential) => {
			var user = userCredential.user.email;
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			throw new HttpException('Bad Request '+errorMessage, HttpStatus.BAD_REQUEST);
		});

		return {
			message: "User is successfully logged in"
		};
	}

	async signOut(): Promise<Response>
	{
		let test = {
			message: "Successfully signedOut"
		}
		firebase.auth().signOut().then(() => {
			test.message = "cool beans";
			return Promise
		}).catch((error) => {
			throw new HttpException('Internal Service Error '+error, HttpStatus.INTERNAL_SERVER_ERROR);
		});

		return test;
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

	async deleteUser(uid: string): Promise<Response>
	{
		admin.auth().deleteUser(uid).then(() => {
			console.log('Successfully deleted user');
		})
		.catch((error) => {
			console.log('Error deleting user:', error);
		});

		return {
			message: "Successfully deleted user"
		};
	}








}
