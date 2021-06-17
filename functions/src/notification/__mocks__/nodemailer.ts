const nodemailer = require('nodemailer');
const nodemailerMock = require('nodemailer-mock').getMockFor(nodemailer);
module.exports = nodemailer;