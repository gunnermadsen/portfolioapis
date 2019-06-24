import {PortfolioServer} from './app';

// Start the server or run tests
if (process.argv[2] !== 'test') {
    let listenPort = process.env.PORT || 3000;
    let server = new PortfolioServer();
    server.start(listenPort);
} else { 
    
}