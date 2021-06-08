const express = require( 'express' );
const path = require('path');
const app = express();

app.use('api/login', require('./routes/loginRoutes'));

const port = process.env.port || 8080; // default port to listen
app.listen(port);


