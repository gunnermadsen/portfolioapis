/* jshint esversion: 6 */

// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';

// let config = require('./config/settings.config');

export class Database {

    constructor() {
        this._connect();
    }

    _connect() {
        mongoose
            .connect(
                process.env.MONGODB_URI || 'mongodb://heroku_cf279h4z:8tuqnuihu94nu4j3mdft4ku5pf@ds131676.mlab.com:31676/heroku_cf279h4z',
                //`${config.PROTOCOL}://${config.SERVER}:${config.PORT}/${config.DATABASE}`,
                {
                    // "auth": { "authSource": "admin" },
                    // "user": `${config.USER}`,
                    // "pass": `${config.PASS}`,
                    useNewUrlParser: true,
                    useCreateIndex: true
                }
            )
            .then(() => console.log(`Mongoose connected to mLab Database at ${process.env.MONGODB_URI}`))
            .catch(err => console.log(`Database connection error: ${err}`));
    }
}

