import { Request, Response, NextFunction } from 'express'
import { DatabaseConnection } from './src/db/db.connection'

import { Server } from '@overnightjs/core'
import { Logger } from '@overnightjs/logger'
import { UserController } from './src/controllers/authentication/authentication.controller'
import { RepositoryController } from './src/controllers/coolshare/repo.controller'
import { KitchenController } from './src/controllers/mindful-meals/kitchen.controller'
import { AccountController } from './src/controllers/account/account.controller'
import { NotificationController } from './src/controllers/notifications/notifications.controller'
import { MeetingsController } from './src/controllers/meetings/meetings.controller'
import { createSocketServer, useSocketServer } from 'socket-controllers'
import { MeetingsSocketController } from './src/controllers/meetings/meetings.socket.controller'

import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as multer from 'multer'
import * as compression from 'compression'
import * as express from 'express'
import * as cluster from 'cluster'
import * as helmet from 'helmet'
import * as http from 'http'
import { join } from 'path'
import { StreamlyController } from './src/controllers/streamly/streamly.controller'

export class PortfolioServer extends Server {

  public get server() {
    return this.app
  }

  public httpServer: any

  constructor() {

    super(process.env.NODE_ENV === 'development')
    // let listenPort = process.env.PORT || 3000

    // if (cluster.isMaster) {

    //   cluster.fork()
    //   cluster.fork()
    //   cluster.fork()
    //   cluster.fork()

    // } else {
      // this.start()
      this.initializeMiddleware()
      this.setupControllers()
    // }

  }

  private initializeMiddleware(): void {
    dotenv.config()

    const storage = multer.diskStorage({
      destination: (req, file, callback) => callback(null, './uploads'),
      filename: (req, file, callback) => callback(null, file.originalname)
    })

    const upload = multer({ storage: storage })

    this.app.use(helmet())
    this.app.use(upload.any())

    
    this.app.use(compression())
    this.app.use(express.static('thumbnails'))
    this.app.use(express.static('assets'))
    this.app.disable('x-powered-by')
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

    this.app.use(cors({
      origin: [
        'http://localhost:4200',
        'http://www.gunner-madsen.com',
        'https://gunner-madsen.com',
        'https://admin.gunner-madsen.com',
        'https://coolshare.herokuapp.com',
        'https://www.shareily.com',
        'https://mindfulmeals.herokuapp.com',
        'http://meetily.herokuapp.com',
        'https://meetily.herokuapp.com'
      ],
      methods: ['POST', 'PUT', 'OPTIONS', 'DELETE', 'GET', 'PATCH'],
      allowedHeaders: [
        'Origin, Access-Control-Allow-Origin, X-Requested-With, Accept-Encoding, Content-Disposition, Content-Type, Accept, Authorization, X-XSRF-TOKEN'
      ],
      credentials: true
    }))

    this.app.use(morgan('dev'))
    this.app.use(cookieParser())

    this.app.use(express.static('src/controllers/streamly'))

    this.app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      response.locals.message = error.message
      response.locals.error = request.app.get('env') === 'development' ? error : {}
      response.status(500).json({ message: error })
    })
  }

  private setupControllers(): void {

    new DatabaseConnection()
  
    const userController = new UserController()
    const repoController = new RepositoryController()
    const kitchenController = new KitchenController()
    const accountController = new AccountController()
    const notificationController = new NotificationController()
    const meetingsController = new MeetingsController()
    const streamlyController = new StreamlyController()


    super.addControllers([ 
      userController, 
      repoController, 
      kitchenController, 
      accountController, 
      notificationController, 
      meetingsController, 
      streamlyController 
    ])
  }

  public start(): void {
    const webListenPort = process.env.PORT || 3000
    this.httpServer = http.createServer(this.app)
    const socket = require('socket.io')(this.httpServer)
    
    this.httpServer.listen(webListenPort, () => Logger.Info(`Portfolioapis listening on port ${webListenPort}`))
    
    // const io: SocketIO.Server = createSocketServer(ioPort, { controllers: [MeetingsSocketController] })

    useSocketServer(socket, { controllers: [MeetingsSocketController] })

    // setInterval(() => {
    //   http.get('http://meetily.herokuapp.com')
    //   http.get('http://mindfulmeals.herokuapp.com')
    //   http.get('http://coolshare.herokuapp.com')
    // }, 300000)
  }
}
