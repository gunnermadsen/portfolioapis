import { PortfolioServer } from './app'

// declare const module: any

let server = new PortfolioServer()

server.start()

// if (module.hot && process.env.NODE_ENV === 'development') {
//     module.hot.accept()
//     module.hot.dispose(() => server.httpServer.close())
// }