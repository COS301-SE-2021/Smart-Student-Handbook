import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
	async verifyUser(authToken: string): Promise<string> {
		return admin
			.auth()
			.verifyIdToken(authToken)
			.then((decodedToken) => {
				if (decodedToken) {
					return decodedToken.uid;
				}
				return '';
			})
			.catch((error) => {
				throw new HttpException(`Was unable to authenticate user. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}
}
