import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
	async verifyUser(authToken: string): Promise<string> {
		return admin
			.auth()
			.verifyIdToken(authToken)
			.then((decodedToken) => decodedToken.uid)
			.catch(() => {
				throw new HttpException('Was unable to authenticate user. Invalid token!', HttpStatus.BAD_REQUEST);
			});
	}
}
