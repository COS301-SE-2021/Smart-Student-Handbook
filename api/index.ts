//const express = require( 'express' );
//const path = require('path');
//const app = express();

//app.use('api/login', require('./routes/loginRoutes'));

//const port = process.env.port || 8080; // default port to listen
//app.listen(port);


//___________________________________________________________________________________________________________________
//_________________Luca Implementation of the request and response objects___________________________________________
//____________________________________________________________________________________________________________________


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


//This ends the index .ts folder

