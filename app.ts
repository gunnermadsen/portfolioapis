/* jshint esversion: 6 */

const dotenv = require('dotenv')
dotenv.config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const cors = require('cors');
const morgan = require('morgan');
// const UserController = require('./src/controllers/user.controller');

import * as AuthRoutes from './src/routes/authentication.router';
import * as KitchenRoutes from './src/routes/mindful-meals.router';

import { Database } from './src/db/db.connection';

let db = new Database();

const app = express();

let mode: string = "";

const PORT: number = 3000;

app.use((request: Request, response: Response, next: any) => {
  mode = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : "";
  next();
})

app.use(cors());

//app.use('/public', express.static(__dirname + '/app_api/controllers/repo'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (request: any, response: any) => response.send('portfolio apis'));

app.use('/api/auth', AuthRoutes);
app.use('/api/kitchen', KitchenRoutes);

// catch 404 and forward to error handler
app.use((req: any, res: any, next: any) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(500).json({ message: err });
  res.render('error');
});


app.listen(PORT, () => console.log(`HTTP RESTful service listening on ${PORT}`)); 