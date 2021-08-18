import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AccountController } from "../../src/account/account.controller";
import { AccountService } from "../../src/account/account.service";
import { INestApplication } from '@nestjs/common';

describe('Account', () => {
	let app: INestApplication;
	let accountService;

	// beforeAll(async () => {
	// 	const moduleRef = await Test.createTestingModule({
	// 		imports: [],
	// 	})
	// 		.overrideProvider(CatsService)
	// 		.useValue(catsService)
	// 		.compile();
	//
	// 	app = moduleRef.createNestApplication();
	// 	await app.init();
	// });
	//
	// it(`/GET cats`, () => {
	// 	return request(app.getHttpServer())
	// 		.get('/cats')
	// 		.expect(200)
	// 		.expect({
	// 			data: catsService.findAll(),
	// 		});
	// });
	describe('createUser', () => {
		it('Test should register a user successfully', async () => {
			// const user = {
			// 	email: `TestAccount${randomNumber}@gmail.com`,
			// 	password: 'TestPassword01!',
			// 	passwordConfirm: 'TestPassword01!',
			// 	username: `TestAccount${randomNumber}`,
			// 	isLocalHost: true,
			// };
			// console.log(user);
			//
			// const result = await accountService.registerUser(user);
			// console.log(result);
			// userId = result.user.uid;
			//
			// expect(result.message).toBe('User is successfully registered!');
		});
	});
});