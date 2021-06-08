//const express = require( 'express' );
//const path = require('path');
//const app = express();

//app.use('api/login', require('./routes/loginRoutes'));

//const port = process.env.port || 8080; // default port to listen
//app.listen(port);


//___________________________________________________________________________________________________________________
//_________________Luca Implementation of the request and response objects___________________________________________
//____________________________________________________________________________________________________________________

// @ts-ignore
import * as functions from 'firebase-functions';
// @ts-ignore
import * as admin from 'firebase-admin';
import * as express from 'express';

admin.initializeApp();

const app = express();

export const api = functions.https.onRequest(app);
