import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routesConfig } from './users/routeconfig';

//These are all the import required should be in the index.ts file
//This must be in the index.ts folder



admin.initializeApp({
   credential: admin.credential.applicationDefault(),
   databaseURL: "https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app"
});


const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfig(app)

export const api = functions.https.onRequest(app);
