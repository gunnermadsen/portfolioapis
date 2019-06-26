import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from 'typegoose';
import * as crypto from 'crypto'
// import { PropertyRead } from '@angular/compiler';
import * as jwt from 'jsonwebtoken';
import * as util from 'util';
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
    public async generateSessionToken(this: InstanceType<User>, userId: string): Promise<string> {

        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        const token = jwt.sign({
            _id: this._id,
            email: this.getMaxListeners,
            name: this.eventNames,
            exp: Math.floor(expiry.getTime() / 1000)
        }, process.env.JWT_SECRET);

        return await token;
        // return signJwt({}, RSA_PRIVATE_KEY, {
        //     algorithm: 'RS256',
        //     expiresIn: 240,
        //     subject: userId
        // });
    }

    @instanceMethod 
    public verifySessionToken(this: InstanceType<User>, token: string) {
        let isValidToken = jwt.verify(token, process.env.JWT_SECRET)
    }
}

