// import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('AccountController', () => {
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    userService = new UserService();
    userController = new UserController(userService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
