import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { NoteService } from './note.service';
import { AccessService } from '../access/access.service';

admin.initializeApp();
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');

mockGoogleCloudFirestore({
	database: {
		users: [
			{
				bio: 'TestBio',
				dateJoined: 'test date here',
				department: 'Test department',
				institution: 'test institution',
				username: 'test Name',
				program: 'Test program',
				uid: 'UserIdTest',
				workStatus: 'test status',
			},
		],
		userNotebooks: [
			{
				title: 'Updated Title',
				author: 'Updated Author',
				course: 'Updated Course',
				description: 'Updated Description',
				institution: 'Updated Institution',
				notebookId: 'NotebookId',
				creatorId: 'UserIdTest',
				private: false,
				tags: ['update tag1', 'update tag2'],
			},
		],
		notebookAcces: [
			{
				displayName: 'Test Display Name',
				userId: 'UserIdTest',
				profileUrl: 'Test Profile Url',
				notebookId: 'NotebookId',
			},
		],
	},
});

const userId = 'UserID';
const noteId = '1';
const notebookId = 'notebookId';
describe('NoteService', () => {
	let service: NoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NoteService, AccessService],
		}).compile();

		service = module.get<NoteService>(NoteService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Create a New Note', () => {
		it('Test should create a new note on the specified notebook', async () => {
			const note = {
				name: 'Test Note Title',
				notebookId,
				description: 'Test Note Description',
				userId,
				tags: [],
			};

			let result;
			try {
				result = await service.createNote(note, userId);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('User does not have access to create a new note in this notebook.');
		});
	});

	describe('Get Notebook Notes', () => {
		it('Test should return a list of notes that are contained in this notebook(thus 2 notes)', async () => {
			const result = await service.getNotes(notebookId);

			expect(result.length).toBe(0);
		});
	});

	describe('Update Note', () => {
		it('Test should update a note on a notebook', async () => {
			const note = {
				name: 'Update Note Title',
				notebookId,
				noteId,
				description: 'Update Note Description',
				userId,
				tags: [],
			};
			let result;
			try {
				result = await service.updateNote(note, userId);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('User does not have access to create a new note in this notebook.');
		});
	});

	describe('Get updated Notebook Notes', () => {
		it('Test should return a list of notes that are contained in this notebook(thus 2 notes)', async () => {
			const result = await service.getNotes(notebookId);

			expect(result.length).toBe(0);
		});
	});

	describe('Get notes after deleting a note', () => {
		it('Test should return 1 note since the other note was deleted in the previous test', async () => {
			const result = await service.getNotes(notebookId);

			expect(result.length).toBe(0);
		});
	});
});
