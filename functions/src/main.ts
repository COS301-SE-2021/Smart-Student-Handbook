import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import firebase from 'firebase/app';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const express = require('express');

const server = express();

// eslint-disable-next-line @typescript-eslint/no-shadow
export async function createNestServer(server: Express) {
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

	app.enableCors();
	// await app.listen(process.env.PORT || 5001);
	admin.initializeApp({
		credential: admin.credential.applicationDefault(),
		databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
	});

	const firebaseConfig = {
		apiKey: 'AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0',
		authDomain: 'smartstudentnotebook.firebaseapp.com',
		databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
		projectId: 'smartstudentnotebook',
		storageBucket: 'smartstudentnotebook.appspot.com',
		messagingSenderId: '254968215542',
		appId: '1:254968215542:web:be0931c257ad1d8a60b9d7',
		measurementId: 'G-YDRCWDT5QJ',
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	await app.init();
	return app;
}

createNestServer(server)
	.then(() => console.log('Nest Ready'))
	.catch((err) => console.error('Nest broken', err));

export const app = functions.https.onRequest(server);

export const api = functions.https.onRequest((req, res) => {
	res.send('Functions are Working!!');
});

exports.algoliaFunctions = require('./algoliaFunctions/algolia.service');

// const algoliasearch = require('algoliasearch')

// const APP_ID = functions.config().algolia.app;
// const ADMIN_KEY = functions.config().algolia.key;
//
// const client = algoliasearch(APP_ID, ADMIN_KEY);
// const index = client.initIndex('userNotebooks');
//
// exports.addNotebookIndex = functions.firestore.document('userNotebooks/{notebookId}').onCreate((snapshot) => {
// 	const data = snapshot.data();
// 	const objectID = snapshot.id;
//
// 	index.saveObject({ data, objectID });
// });
//
// exports.updateNotebookIndex = functions.firestore.document('userNotebooks/{userNotebookId}').onUpdate((change) => {
// 	const newData = change.after.data();
// 	const objectID = change.after.id;
//
// 	index.saveObject({ newData, objectID });
// });
//
// exports.deleteNotebookIndex = functions.firestore
// 	.document('userNotebooks/{userNotebookId}')
// 	.onDelete((snapshot) => index.deleteObject(snapshot.id));
