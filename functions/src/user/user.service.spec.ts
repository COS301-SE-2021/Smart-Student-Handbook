import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as admin from "firebase-admin";
import {mockCollection, mockDelete, mockDoc, mockGet, mockSet, mockWhere} from "firestore-jest-mock/mocks/firestore";
import {HttpException} from "@nestjs/common";
admin.initializeApp();
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');

mockGoogleCloudFirestore({
  database: {
    users: [
      {  bio: 'TestBio',
        dateJoined: 'test date here',
        department: 'Test department',
        institution: 'test institution',
        name: "test Name",
        program: "Test program",
        uid: "UserIdTest",
        workStatus: "test status",
      },

    ],


  },
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getUserDetails" , ()=>{
    describe("This should retrieve the user details with the current uid" , ()=>{
      it("if uid is valid return user details" , async()=>{

      })
    })
  })
});







