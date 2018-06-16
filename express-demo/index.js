const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express(); 

app.set('view engine', 'pug');
app.set('views', './views');  // default

app.use(express.json());  // req.body 
app.use(express.urlencoded({ extended: true})); // key=value&key=value 
app.use(express.static('public'));  //assets like css, html ,images in this folder
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password'));
 
if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enables...');
}

// Db work...
dbDebugger('Connected to the database...');

app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});