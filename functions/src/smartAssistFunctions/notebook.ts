import * as functions from 'firebase-functions';

exports.addNotebook = functions.firestore.document('userNotebooks/{notebookId}').onCreate((snapshot) => {
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

	fetch('https://smartassit-nii4biypla-uc.a.run.app/addData', {
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

exports.updateNotebook = functions.firestore.document('userNotebooks/{notebookId}').onUpdate((change) => {
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

	fetch('https://smartassit-nii4biypla-uc.a.run.app/editData', {
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

exports.deleteNotebook = functions.firestore.document('userNotebooks/{notebookId}').onDelete((snapshot) => {
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

	fetch('https://smartassit-nii4biypla-uc.a.run.app/removeData', {
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
