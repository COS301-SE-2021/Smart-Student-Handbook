import * as admin from 'firebase-admin';

import { Test, TestingModule } from '@nestjs/testing';
import {
	mockCollection,
	mockDelete,
	mockDoc,
	mockGet,
	mockSet,
	mockWhere,
} from 'firestore-jest-mock/mocks/firestore';
import { HttpException } from '@nestjs/common';
import firebase from 'firebase/app';
import { NotebookService } from './notebook.service';

const firebaseConfig = {
	apiKey: 'AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0',
	authDomain: 'smartstudentnotebook.firebaseapp.com',
	databaseURL:
		'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'smartstudentnotebook',
	storageBucket: 'smartstudentnotebook.appspot.com',
	messagingSenderId: '254968215542',
	appId: '1:254968215542:web:be0931c257ad1d8a60b9d7',
	measurementId: 'G-YDRCWDT5QJ',
};
firebase.initializeApp(firebaseConfig);

admin.initializeApp();

const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
const NoteBookDTo = require('./dto/notebook.dto');

mockGoogleCloudFirestore({
	database: {
		notebooks: [
			{
				id: 'TestID',
				title: 'title',
				author: 'author',
				course: 'course',
				description: 'description',
				institution: 'institution',
				name: 'name',
				surname: 'surname',
				private: 'private',
				username: 'username',
				notebookReference: 'TestID',
				userId: 'UserIdTest',
			},
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

	// Test the Find ALL USERS NOTEBOOK
	describe('FindAllUserNoteBooks', () => {
		describe('when a notebook matches a user id', () => {
			it('Return the notebooks of the user with the user ID', async () => {
				const authMock = jest.fn(() => ({
					createUserAndRetrieveDataWithEmailAndPassword: jest.fn(() =>
						Promise.resolve(true),
					),
					sendPasswordResetEmail: jest.fn(() => Promise.resolve(true)),
					signInAndRetrieveDataWithEmailAndPassword: jest.fn(() =>
						Promise.resolve(true),
					),
					fetchSignInMethodsForEmail: jest.fn(() => Promise.resolve(true)),
					signOut: jest.fn(() => {
						Promise.resolve(true);
					}),
					onAuthStateChanged: jest.fn(),
					currentUser: {
						sendEmailVerification: jest.fn(() => Promise.resolve(true)),
					},
				}));
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				firebase.auth = authMock;
				await service.findAllUserNotebooks();
				expect(mockCollection).toHaveBeenCalledWith('notebooks');
				expect(mockWhere).toHaveBeenCalled();
			});
		});
	});

	it('Note book service should be defined', () => {
		expect(service).toBeDefined();
	});

	// Test for the findNoteBookByID function

	describe('FindNoteBookByID', () => {
		describe('when an ID matches a notebook', () => {
			it('Return the notebook associated with the id', async () => {
				await service.findNotebookById('TestID');
				expect(mockCollection).toHaveBeenCalledWith('notebooks');
				expect(mockGet).toBeCalled();
			});
		});

		describe('when an ID  does not match a notebook', () => {
			it('Throw and error', () =>
				expect(service.findNotebookById('TestID2')).rejects.toThrow(
				HttpException,
			));
		});
	});
	// Test to delete a notebook
	describe('DeleteNotebook', () => {
		describe('when a notebook matches a notebookID', () => {
			it('Delete the notebook', async () => {
				await service.deleteNotebook('TestID');
				expect(mockCollection).toHaveBeenCalledWith('notebooks');
				expect(mockDelete).toHaveBeenCalled();
			});
		});
	});

	// Test for createOrUpdateNotebook

	describe('createOrUpdateNotebook', () => {
		describe('when a notebook matches a notebookID the it can ', () => {
			it('Update the notebook ', async () => {
				NoteBookDTo.NotebookDto = jest.fn(() => [
					{
						title: 'title',
						author: 'author',
						course: 'course',
						description: 'description is updated now',
						institution: 'institution',
						name: 'name',
						surname: 'surname',
						private: 'private',
						username: 'username',
						notebookReference: 'TestID',
						userId: 'UserIdTest',
					},
				]);
				await service.createOrUpdateNotebook(NoteBookDTo, 'TestID');
				expect(mockCollection).toHaveBeenCalledWith('notebooks');
				expect(mockDoc).toHaveBeenCalledWith('TestID');
				expect(mockSet).toHaveBeenCalled();
			});
		});

		describe('if no notebook id is provide ', () => {
			it('Create a new Notebook ', async () => {
				await service.createOrUpdateNotebook(NoteBookDTo, '');
				expect(mockCollection).toHaveBeenCalledWith('notebooks');
				expect(mockDoc).toHaveBeenCalled();
				expect(mockSet).toHaveBeenCalled();
			});
		});
	});
});
