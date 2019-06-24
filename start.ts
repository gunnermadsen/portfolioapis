import {PortfolioServer} from './app';

// Start the server or run tests
if (process.argv[2] !== 'test') {
    let server = new PortfolioServer();
    server.start();
} else { 
    
}