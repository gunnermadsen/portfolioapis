/* jshint esversion: 6 */

const dotenv = require('dotenv')
dotenv.config();


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
// const pageRoutes = require('./app_server/routes/index');
//const apiRoutes = require('./src/routes/index');
const cors = require('cors');
const morgan = require('morgan');
const userController = require('./src/controllers/user.controller');

import { Database } from './src/models/db.connection';



let db = new Database();

const app = express();

app.use(cors());

//app.use('/public', express.static(__dirname + '/app_api/controllers/repo'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use('/', pageRoutes);
app.use('/api', userController);

// catch 404 and forward to error handler
app.use((req: any, res: any, next: any) => {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(500).json({ message: err });
  //res.render('error');
});


const httpServer = app.listen(3500, () => {
  console.log("HTTP REST API server running at http://localhost:3500");
});