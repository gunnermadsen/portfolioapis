import { PortfolioServer } from './app'

// declare const module: any

let server = new PortfolioServer()

server.start()

// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => server.httpServer.close())
// }