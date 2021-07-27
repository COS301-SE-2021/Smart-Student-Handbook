// import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { NotificationService } from '../notification/notification.service';

describe('AccountController', () => {
  let accountService: AccountService;
  let accountController: AccountController;

  beforeEach(async () => {
    accountService = new AccountService(new NotificationService());
    accountController = new AccountController(accountService);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });
});
