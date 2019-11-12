import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as multer from 'multer'
import * as compression from 'compression'
import * as express from 'express'
import * as cluster from 'cluster'

import * as io from 'socket.io'

import * as http from 'http'

import { Request, Response, NextFunction } from 'express'
import { Database } from './src/db/db.connection'

import { Server } from '@overnightjs/core'
import { Logger } from '@overnightjs/logger'
import { UserController } from './src/controllers/authentication/authentication.controller'
import { RepositoryController } from './src/controllers/coolshare/repo.controller'
import { KitchenController } from './src/controllers/mindful-meals/kitchen.controller'
import { AccountController } from './src/controllers/account/account.controller'
import { NotificationController } from './src/controllers/notifications/notifications.controller'
import { MeetingsController } from './src/controllers/meetings/meetings.controller'
import { createSocketServer } from 'socket-controllers'
import { MeetingsSocketController } from './src/controllers/meetings/meetings.socket.controller'

declare const module: any;

export class PortfolioServer extends Server {

  public get server() {
    return this.app
  }

  // private _application: http.Server

  constructor() {

    super(process.env.NODE_ENV === 'development')
    // let listenPort = process.env.PORT || 3000

    // if (cluster.isMaster) {

    //   cluster.fork()
    //   cluster.fork()
    //   cluster.fork()
    //   cluster.fork()

    // } else {
    // }

    this.start()
    this.initializeMiddleware()
    this.setupControllers()

    // const server = http.createServer(this.app)

    // if (!sticky.listen(server, listenPort)) {

    //   server.once('listening', () => {
    //     Logger.Info(`Portfolioapis listening on port ${listenPort}`)
    //   })

    // } else {
    //   this.start()
    //   this.initializeMiddleware()
    //   this.setupControllers()
    // }
  }

  private initializeMiddleware(): void {
    dotenv.config()

    const storage = multer.diskStorage({
      destination: (req, file, callback) => callback(null, './uploads'),
      filename: (req, file, callback) => callback(null, file.originalname)
    })

    const upload = multer({ storage: storage })

    this.app.use(upload.any())

    this.app.use(compression())
    this.app.use(express.static('thumbnails'))
    this.app.disable('x-powered-by')
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

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
    }))

    this.app.use(morgan('dev'))
    this.app.use(cookieParser())

    this.app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      response.locals.message = error.message
      response.locals.error = request.app.get('env') === 'development' ? error : {}
      response.status(500).json({ message: error })
    })
  }

  private setupControllers(): void {

    new Database()
  
    const userController = new UserController()
    const repoController = new RepositoryController()
    const kitchenController = new KitchenController()
    const accountController = new AccountController()
    const notificationController = new NotificationController()
    const meetingsController = new MeetingsController()

    super.addControllers([ userController, repoController, kitchenController, accountController, notificationController, meetingsController ])
  }

  private start(): void {
    let listenPort = process.env.PORT || 3000

    const server = http.createServer(this.app)
    const io: SocketIO.Server = createSocketServer(3434, { controllers: [MeetingsSocketController] })

    server.listen(listenPort, () => Logger.Info(`Portfolioapis listening on port ${listenPort}`))

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => server.close());
      module.hot.dispose(() => io.close());
    }

    // const server: string = process.env.NODE_ENV === 'development' ? 'localhost' : 'portfolioapis.herokuapp.com'

    // io.adapter(redisAdapter({ host: server, port: 3434 }))

    Logger.Info("Socket IO Server Listening on Port 3434")

  }
}
