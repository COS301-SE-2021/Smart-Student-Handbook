import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import * as admin from "firebase-admin";
import {mockCollection } from "firestore-jest-mock/mocks/firestore";
import {mockCreateUserWithEmailAndPassword, mockSignInWithEmailAndPassword} from "firestore-jest-mock/mocks/auth";
import firebase from "firebase/app";
import {environment} from "../../../frontend/src/environments/environment";


admin.initializeApp();

const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
const registerDTO = require('./dto/register.dto.ts')
const loginDTO = require('./dto/login.dto.ts')
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
      it('If all user details are entered correctly the user will be registered' , ()=>{
            registerDTO.RegisterDto= jest.fn(()=>[{
              email: 'Test@gmail.com',
              phoneNumber: '0721234567',
              displayName: 'UserTestName',
              password: 'TestPassword',
              passwordConfirm: 'TestPassword'
            }]);


             expect(service.registerUser(registerDTO)).resolves.toMatchObject({
             message: "User is successfully registered!"
           });
      })
    })


  })

  describe('LoginUser'  , ()=>{
    describe("Allow a user to login",()=>{
      it("If user credentials are correct they will be logged in",()=>{
        loginDTO.LoginDtoDto= jest.fn( ()=>[{
          email: 'Test@gmail.com',
          password: 'TestPassword',

        }]);

       //Todo
      })
    })
  })

});




