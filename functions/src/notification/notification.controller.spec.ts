// import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('AccountController', () => {
	let notificationService: NotificationService;
	let notificationController: NotificationController;

	beforeEach(async () => {
		notificationService = new NotificationService();
		notificationController = new NotificationController(notificationService);
	});

	it('should be defined', () => {
		expect(notificationController).toBeDefined();
	});
});
