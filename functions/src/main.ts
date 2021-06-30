import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require('dotenv');
import * as admin from 'firebase-admin';
import firebase from 'firebase/app';
import { Express } from 'express';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

export async function createNestServer(server: Express) {
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
	app.enableCors();
	await app.listen(process.env.PORT || 5001);
	admin.initializeApp({
		credential: admin.credential.applicationDefault(),
		databaseURL:
			'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
	});

	var firebaseConfig = {
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
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	return app.init();
}

createNestServer(server)
	.then((v) => console.log('Nest Ready'))
	.catch((err) => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);
