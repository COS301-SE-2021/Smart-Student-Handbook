import * as functions from 'firebase-functions';

const algoliaSearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliaSearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('userNotes');

exports.addUserNotesIndex = functions.firestore.document('userNotes/{uid}').onCreate((snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	index.saveObject({ data, objectID });
});

exports.updateUserNotesIndex = functions.firestore.document('userNotes/{uid}').onUpdate((change) => {
	const data = change.after.data();
	const objectID = change.after.id;

	index.saveObject({ data, objectID });
});

exports.deleteUserNotesIndex = functions.firestore.document('userNotes/{uid}').onDelete((snapshot) => {
	const { id } = snapshot;
	functions.logger.log('User Object ID: ', id);
	functions.logger.log('User Object: ', snapshot);

	index.deleteObject(id);
});
