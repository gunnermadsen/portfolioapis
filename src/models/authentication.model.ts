import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from 'typegoose';

import * as mongoose from 'mongoose';
import * as crypto from 'crypto'
// import { PropertyRead } from '@angular/compiler';
import * as jwt from 'jsonwebtoken';

import * as fs from 'fs';
import { Database } from './db.connection';

const util = require('util');
// const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + '/key/private.key');
// const RSA_PUBLIC_KEY = fs.readFileSync(__dirname + '/key/public.key');

export const signJwt = util.promisify(jwt.sign);

export class User extends Typegoose {
    @prop({ required: true }) firstname: string;
    @prop({ required: true }) lastname: string;
    @prop({ unique: true, required: true }) username: string;
    @prop() salt?: string;
    @prop() hash?: string;

    @instanceMethod setPassword(this: InstanceType<User>, password: string) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this.hash;
    }

    @instanceMethod validatePassword(this: InstanceType<User>, password: string) {
        let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this.hash = hash;
    }

    @instanceMethod generateSessionToken(this: InstanceType<User>, userId: string) {
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
            _id: this._id,
            email: this.getMaxListeners,
            name: this.eventNames,
            exp: Math.floor(expiry.getTime() / 1000)
        }, process.env.JWT_SECRET);

        // return signJwt({}, RSA_PRIVATE_KEY, {
        //     algorithm: 'RS256',
        //     expiresIn: 240,
        //     subject: userId
        // });
    }

    @instanceMethod verifySessionToken(this: InstanceType<User>, token: string) {
        let isValidToken = jwt.verify(token, process.env.JWT_SECRET)
    }
}

