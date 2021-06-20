import {NotebookService} from "./notebook.service";

import * as admin from "firebase-admin";

import { Test, TestingModule } from '@nestjs/testing';
import {mockCollection, mockDelete, mockDoc, mockGet, mockSet, mockWhere } from "firestore-jest-mock/mocks/firestore";
import {HttpException} from "@nestjs/common";
import firebase from "firebase/app";
import {environment} from "../../../frontend/src/environments/environment";





admin.initializeApp();
firebase.initializeApp(environment.firebase);

const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
const NoteBookDTo = require("./dto/notebook.dto")

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

                const authMock = jest.fn(() => {
                    return {
                        createUserAndRetrieveDataWithEmailAndPassword: jest.fn(() =>
                            Promise.resolve(true)
                        ),
                        sendPasswordResetEmail: jest.fn(() => Promise.resolve(true)),
                        signInAndRetrieveDataWithEmailAndPassword: jest.fn(() =>
                            Promise.resolve(true)
                        ),
                        fetchSignInMethodsForEmail: jest.fn(() => Promise.resolve(true)),
                        signOut: jest.fn(() => {
                            Promise.resolve(true);
                        }),
                        onAuthStateChanged: jest.fn(),
                        currentUser: {
                            sendEmailVerification: jest.fn(() => Promise.resolve(true))
                        }
                    };
                });
                // @ts-ignore
                firebase.auth=authMock;
                await service.findAllUserNotebooks();
                 expect(mockCollection).toHaveBeenCalledWith('notebooks');
                 expect(mockWhere).toHaveBeenCalled();
             })
         })

     })

   it('Note book service should be defined', () => {
     expect(service).toBeDefined();
   });

  //Test for the findNoteBookByID function

     describe('FindNoteBookByID',()=>{
         describe('when an ID matches a notebook',()=>{
             it('Return the notebook associated with the id',async()=>{

                 await service.findNotebookById('TestID');
                 expect(mockCollection).toHaveBeenCalledWith('notebooks');
                 expect(mockGet).toBeCalled();
             })
         })

         describe('when an ID  does not match a notebook',()=>{
             it('Throw and error',()=>{


                 return expect(  service.findNotebookById('TestID2')).rejects.toThrow(HttpException);
             })
         })

    })
     //Test to delete a notebook
     describe('DeleteNotebook',()=>{
         describe('when a notebook matches a notebookID',()=>{
             it('Delete the notebook',async()=>{

                 await service.deleteNotebook('TestID');
                 expect(mockCollection).toHaveBeenCalledWith('notebooks');
                 expect(mockDelete).toHaveBeenCalled();
             })
         })

         describe('when a notebook does not match a notebookID',()=>{
             it('The notebook should not be deleted',()=>{

                 //return  expect( service.deleteNotebook( 'TestID2' )).rejects.toThrow(HttpException);

             })
         })
     })



     //Test for createOrUpdateNotebook

     describe('createOrUpdateNotebook',()=>{
         describe('when a notebook matches a notebookID the it can ',()=>{
             it('Update the notebook ',async()=>{

                NoteBookDTo.NotebookDto = jest.fn(()=>[{
                    title: 'title',
                    author: "author",
                    course: "course",
                     description: "description is updated now",
                     institution: "institution",
                     name: "name",
                     surname: "surname",
                     private: "private",
                     username: "username",
                     notebookReference: "TestID",
                     userId: "UserIdTest",
                 }]);
                 await service.createOrUpdateNotebook(NoteBookDTo , 'TestID');
                 expect(mockCollection).toHaveBeenCalledWith('notebooks');
                 expect(mockDoc).toHaveBeenCalledWith('TestID');
                 expect(mockSet).toHaveBeenCalled();

             })
         })

         describe('if no notebook id is provide ' , ()=>{
             it('Create a new Notebook ' , async()=>{
                 await service.createOrUpdateNotebook(NoteBookDTo , '');
                 expect(mockCollection).toHaveBeenCalledWith('notebooks');
                 expect(mockDoc).toHaveBeenCalled();
                 expect(mockSet).toHaveBeenCalled();
             })
             })

         describe('if the notebook id is wrong  ' , ()=>{
             it('An error should be given ' , ()=>{

                 //return expect(service.createOrUpdateNotebook(NoteBookDTo ,'TestID2' )).rejects.toThrow(HttpException);
            })
         })

     })





 });

