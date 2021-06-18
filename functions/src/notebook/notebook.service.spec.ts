import {NotebookService} from "./notebook.service";

import * as admin from "firebase-admin";



import { Test, TestingModule } from '@nestjs/testing';
import {mockCollection, mockWhere} from "firestore-jest-mock/mocks/firestore";
import firebase from "firestore-jest-mock";
import {HttpException} from "@nestjs/common";
admin.initializeApp();
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');

mockGoogleCloudFirestore({
    database: {
        notebooks: [
            {   id: 'TestID',
                title: 'title',
                author: "author",
                course: "course",
                description: "description",
                institution: "institution",
                name: "name",
                surname: "surname",
                private: "private",
                username: "username",
                notebookReference: "TestID",
                userId: "UserIdTest", },

        ],


    },
});

describe('NotebookService', () => {
  let service: NotebookService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotebookService],
    }).compile();

    service = module.get<NotebookService>(NotebookService);
  });
  //Test the Find ALL USERS NOTEBOOK
    describe('FindAllUserNoteBooks',()=>{
        describe('when a notebook matches a user id',()=>{
            it('Return the notebooks of the user with the user ID',async()=>{
                const { Firestore } = require('@google-cloud/firestore');
                const firestore = new Firestore();


                await service.findAllUserNotebooks('UserIdTest');
                expect(mockCollection).toHaveBeenCalledWith('notebooks');
                expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'UserIdTest');
            })
        })

    })

  it('Note book service should be defined', () => {
    expect(service).toBeDefined();
  });









});




