import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from 'typegoose';
import * as crypto from 'crypto'
// import { PropertyRead } from '@angular/compiler';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as util from 'util';
import { request, response } from 'express';

const RSA_PUBLIC_KEY = fs.readFileSync('./.keys/public.key');
const RSA_PRIVATE_KEY = fs.readFileSync('./.keys/private.key');
// const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + '/key/private.key');
// const RSA_PUBLIC_KEY = fs.readFileSync(__dirname + '/key/public.key');

export const signJwt = util.promisify(jwt.sign);

export class User extends Typegoose {
    // @prop({ required: true }) firstname: string;
    // @prop({ required: true }) lastname: string;
    @prop({ unique: true, required: true }) 
    public UserName: string;

    @prop() 
    public Salt?: string;

    @prop() 
    public Hash?: string;

    @instanceMethod 
    public setPassword(this: InstanceType<User>, Password: string) {
        this.Salt = crypto.randomBytes(16).toString('hex');
        this.Hash = crypto.pbkdf2Sync(Password, this.Salt, 1000, 64, 'sha512').toString('hex');
        return this.Hash;
    }

    @instanceMethod 
    public validatePassword(this: InstanceType<User>, Password: string) {
        let Hash = crypto.pbkdf2Sync(Password, this.Salt, 1000, 64, 'sha512').toString('hex');
        return this.Hash = Hash;
    }

    @instanceMethod 
    public async generateSessionToken(this: InstanceType<User>): Promise<string> {

        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        const payload = {
            _id: this._id,
            email: this.UserName,
            exp: Math.floor(expiry.getTime() / 1000)
        }

        return await jwt.sign(payload, RSA_PRIVATE_KEY, { algorithm: 'RS256'});
    }

    @instanceMethod
    public async verifySessionToken(this: InstanceType<User>, token: string) {

        const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
        return payload;
        
    }

    @instanceMethod
    public async generateCsrfToken(this: InstanceType<User>) {
        const payload = await crypto.randomBytes(32).toString('hex');
        return payload;
    }
}

