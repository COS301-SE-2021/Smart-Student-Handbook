import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
import { HttpException, HttpStatus } from '@nestjs/common';

exports.addNotebook = functions.firestore.document('userNotes/{notebookId}').onCreate(async (snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	const notebook = await admin
		.firestore()
		.collection('userNotebooks')
		.where('notebookId', '==', data.notebookId)
		.limit(1)
		.get()
		.then((doc) => doc.docs.pop().data())
		.catch((error) => {
			throw new HttpException(`Could not retrieve notebook. ${error}`, HttpStatus.BAD_REQUEST);
		});

	const noteData = {
		noteId: objectID,
		name: data.title,
		tags: data.tags,
		author: notebook.author,
		institution: notebook.institution,
		course: notebook.course,
	};

	console.log(JSON.stringify(noteData));

	fetch('https://smartassist-nii4biypla-uc.a.run.app/addData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(noteData),
	})
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			console.error(err);
		});
});

exports.updateNotebook = functions.firestore.document('userNotes/{notebookId}').onUpdate(async (change) => {
	const data = change.after.data();
	const objectID = change.after.id;

	const notebook = await admin
		.firestore()
		.collection('userNotebooks')
		.where('notebookId', '==', data.notebookId)
		.limit(1)
		.get()
		.then((doc) => doc.docs.pop().data())
		.catch((error) => {
			throw new HttpException(`Could not retrieve notebook. ${error}`, HttpStatus.BAD_REQUEST);
		});

	const noteData = {
		noteId: objectID,
		name: data.title,
		tags: data.tags,
		author: notebook.author,
		institution: notebook.institution,
		course: notebook.course,
	};

	fetch('https://smartassist-nii4biypla-uc.a.run.app/editData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(noteData),
	})
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			console.error(err);
		});
});

exports.deleteNotebook = functions.firestore.document('userNotes/{notebookId}').onDelete(async (snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	const notebook = await admin
		.firestore()
		.collection('userNotebooks')
		.where('notebookId', '==', data.notebookId)
		.limit(1)
		.get()
		.then((doc) => doc.docs.pop().data())
		.catch((error) => {
			throw new HttpException(`Could not retrieve notebook. ${error}`, HttpStatus.BAD_REQUEST);
		});

	const noteData = {
		noteId: objectID,
		name: data.title,
		tags: data.tags,
		author: notebook.author,
		institution: notebook.institution,
		course: notebook.course,
	};

	fetch('https://smartassist-nii4biypla-uc.a.run.app/removeData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(noteData),
	})
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			console.error(err);
		});
});
