/* jshint esversion: 6 */

// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
import { Logger } from '@overnightjs/logger';


// let config = require('./config/settings.config');

export class Database {

    constructor() {
        this.connect();
    }

    private connect() {
        const connectionString = process.env.MONGODB_URI || 'mongodb://heroku_cf279h4z:8tuqnuihu94nu4j3mdft4ku5pf@ds131676.mlab.com:31676/heroku_cf279h4z'
        mongoose
            .connect(
                connectionString,
                //`${config.PROTOCOL}://${config.SERVER}:${config.PORT}/${config.DATABASE}`,
                {
                    // "auth": { "authSource": "admin" },
                    // "user": `${config.USER}`,
                    // "pass": `${config.PASS}`,
                    useNewUrlParser: true,
                    useCreateIndex: true
                }
            )
            .then(() => Logger.Info(`Mongoose connected to mLab Database at ${connectionString}`))
            .catch(err => Logger.Err(`Database connection error: ${err}`));
    }
}

