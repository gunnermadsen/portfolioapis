import * as dotenv from 'dotenv';

import * as createError from 'http-errors';
import * as path from 'path';
import * as express from 'express';

import customRouter from 'express-promise-router';

import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';
import { Database } from './src/db/db.connection';

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { UserController } from './src/controllers/authentication/authentication.controller';

export class PortfolioServer extends Server {

  constructor() {

    dotenv.config();

    super(process.env.NODE_ENV === 'development');

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(cookieParser());

    this.app.use((request: Request, response: Response, next: NextFunction) => {
      response.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // error handler
    this.app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      // set locals, only providing error in development
      response.locals.message = error.message;
      response.locals.error = request.app.get('env') === 'development' ? error : {};
      response.status(500).json({ message: error });
    });
    
    this.setupControllers();

  }

  private setupControllers(): void {
    
    const db = new Database();
    let userController = new UserController();
    super.addControllers([userController]);
  }

  public start(): void {
    let listenPort = process.env.PORT || 3000;
    this.app.listen(listenPort, () => {
      Logger.Info(`Portfolioapis listening on port ${listenPort}`);
    })
  }
}
