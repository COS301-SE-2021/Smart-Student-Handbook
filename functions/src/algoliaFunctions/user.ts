import * as functions from 'firebase-functions';

const algoliaSearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliaSearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('users');

exports.addUserIndex = functions.firestore.document('users/{uid}').onCreate((snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	index.saveObject({ data, objectID });
});

exports.updateUserIndex = functions.firestore.document('users/{uid}').onUpdate((change) => {
	const data = change.after.data();
	const objectID = change.after.id;

	index.saveObject({ data, objectID });
});

exports.deleteUserIndex = functions.firestore
	.document('users/{uid}')
	.onDelete((snapshot) => index.deleteObject(snapshot.id));
