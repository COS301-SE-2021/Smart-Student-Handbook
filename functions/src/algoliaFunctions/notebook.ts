import * as functions from 'firebase-functions';

const algoliaSearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliaSearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('userNotebooks');

exports.addNotebookIndex = functions.firestore.document('userNotebooks/{notebookId}').onCreate((snapshot) => {
	const data = snapshot.data();
	const objectID = snapshot.id;

	functions.logger.log('Created Notebook Object: ', snapshot.id);

	index.saveObject({ data, objectID });
});

exports.updateNotebookIndex = functions.firestore.document('userNotebooks/{notebookId}').onUpdate((change) => {
	const data = change.after.data();
	const objectID = change.after.id;

	index.saveObject({ data, objectID });
});

exports.deleteNotebookIndex = functions.firestore.document('userNotebooks/{notebookId}').onDelete((snapshot) => {
	const { id } = snapshot;
	functions.logger.log('Deleted Notebook Object: ', id);

	index.deleteObject(id);
});
