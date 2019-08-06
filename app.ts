import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as multer from 'multer';
import * as compression from 'compression'
import * as express from 'express';

import * as path from 'path';

import { Request, Response, NextFunction } from 'express';
import { Database } from './src/db/db.connection';


import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { UserController } from './src/controllers/authentication/authentication.controller';
import { RepositoryController } from './src/controllers/coolshare/repo.controller';
import { CookbookController } from './src/controllers/mindful-meals/kitchen.controller';
import { AccountController } from './src/controllers/account/account.controller';

export class PortfolioServer extends Server {

  constructor() {

    dotenv.config();

    const upload = multer({ dest: 'uploads/' });
    
    super(process.env.NODE_ENV === 'development');
    
    // this.app.use(compression());

    // this.app.use('/static', express.static(path.join(__dirname, 'src/controllers/coolshare/repository')));
    
    this.app.disable('x-powered-by');

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(cors({
      origin: [
        'http://localhost:4200',
        'http://www.gunner-madsen.com',
        'https://gunner-madsen.com',
        'https://coolshare.herokuapp.com',
        'https://www.shareily.com',
        'https://mindfulmeals.herokuapp.com'
      ],
      methods: ['POST', 'PUT', 'OPTIONS', 'DELETE', 'GET', 'PATCH'],
      allowedHeaders: ['Origin, X-Requested-With, Accept-Encoding, Content-Disposition, Content-Type, Accept, Authorization, X-XSRF-TOKEN'],
      credentials: true 
    }));

    this.app.use(upload.any());

    this.app.use(morgan('dev'));
    this.app.use(cookieParser());

    this.app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      response.locals.message = error.message;
      response.locals.error = request.app.get('env') === 'development' ? error : {};
      response.status(500).json({ message: error });
    });
    
    this.setupControllers();
  }

  private setupControllers(): void {
    
    const db = new Database();

    let userController = new UserController();
    let repoController = new RepositoryController();
    let cookbookController = new CookbookController();
    let accountController = new AccountController();

    super.addControllers([ userController, repoController, cookbookController, accountController ]);
  }

  public start(): void {
    let listenPort = process.env.PORT || 3000;
    this.app.listen(listenPort, () => {
      Logger.Info(`Portfolioapis listening on port ${listenPort}`);
    })
  }
}
