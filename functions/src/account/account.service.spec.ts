import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import * as admin from "firebase-admin";
import {mockCollection } from "firestore-jest-mock/mocks/firestore";
import {mockCreateUserWithEmailAndPassword } from "firestore-jest-mock/mocks/auth";
import {HttpException} from "@nestjs/common";
admin.initializeApp();
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
const registerDTO = require('./dto/register.dto')
mockGoogleCloudFirestore({
  database: {
    users: [


    ],


  },
});

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //test registerUser
  describe('registerUser' , ()=>{
    describe('The user will enter their details' , ()=>{
      it('If all user details are entered correctly the user will be registered' , async()=>{
            registerDTO.RegisterDto= jest.fn(()=>[{
              email: 'Test@gmail.com',
              phoneNumber: '0721234567',
              displayName: 'UserTestName',
              password: 'TestPassword',
              passwordConfirm: 'TestPassword'
            }]);


           await expect(service.registerUser(registerDTO)).resolves.toMatchObject({
             message: "User is successfully registered!"
           });
      })
    })

    describe('The user will enter their details incorrectly' , ()=>{
      it('If all user details are entered incorrectly the user will not be registered' , async()=>{
        registerDTO.RegisterDto= jest.fn(()=>[{
          email: 'Test@gmail.com',
          phoneNumber: '0721234567',
          displayName: 'UserTestName',
          password: 'TestWrPasswords',
          passwordConfirm: 'TestPassword'
        }]);

        //Todo This should fail
        //await expect(service.registerUser(registerDTO)).rejects.toThrow(HttpException);
      })
    })
  })

});




