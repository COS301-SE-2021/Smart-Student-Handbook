import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

exports.addNotebook = functions.firestore.document('userNotes/{notebookId}').onCreate((snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	const notebookData = {
		noteId: objectID,
		name: data.title,
		tags: data.tags,
		author: data.author,
		institution: data.institution,
		course: data.course,
	};

	console.log(JSON.stringify(notebookData));

	fetch('https://smartassist-nii4biypla-uc.a.run.app/addData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(notebookData),
	})
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			console.error(err);
		});
});

exports.updateNotebook = functions.firestore.document('userNotes/{notebookId}').onUpdate((change) => {
	const data = change.after.data();
	const objectID = change.after.id;

	const notebookData = {
		noteId: objectID,
		name: data.title,
		tags: data.tags,
		author: data.author,
		institution: data.institution,
		course: data.course,
	};

	fetch('https://smartassist-nii4biypla-uc.a.run.app/editData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(notebookData),
	})
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			console.error(err);
		});
});

exports.deleteNotebook = functions.firestore.document('userNotes/{notebookId}').onDelete((snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	const notebookData = {
		noteId: objectID,
		name: data.title,
		tags: data.tags,
		author: data.author,
		institution: data.institution,
		course: data.course,
	};

	fetch('https://smartassist-nii4biypla-uc.a.run.app/removeData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(notebookData),
	})
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			console.error(err);
		});
});
