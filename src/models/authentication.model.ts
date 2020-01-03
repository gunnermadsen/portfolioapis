import { prop, DocumentType, getModelForClass } from '@typegoose/typegoose';
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as util from 'util';

const RSA_PUBLIC_KEY = fs.readFileSync('./.keys/public.key');
const RSA_PRIVATE_KEY = fs.readFileSync('./.keys/private.key');
// const PEPPER = fs.readFileSync('./.keys/pepper.key');

export const signJwt = util.promisify(jwt.sign);

export class User {

    @prop({ unique: true, required: true }) 
    public UserName: string;

    @prop() 
    public FirstName: string;

    @prop() 
    public LastName: string;

    @prop({ unique: true, required: true })
    public Email: string;

    @prop({ required: false, unique: true }) 
    public Salt: string;

    @prop()
    public CreatedOn: Date;

    @prop()
    public EditedOn: Date;

    @prop({ required: true, unique: true}) 
    public Hash: string;

    @prop()
    public ProfilePicture: string;

    public setPassword(this: DocumentType<User>, Password: string) {
        this.Salt = crypto.randomBytes(16).toString('hex');
        this.Hash = crypto.pbkdf2Sync(Password, this.Salt, 1000, 64, 'sha512').toString('hex');
        return this.Hash;
    }

    public validatePassword(this: DocumentType<User>, Password: string) {
        let Hash = crypto.pbkdf2Sync(Password, this.Salt, 1000, 64, 'sha512').toString('hex');
        return this.Hash = Hash;
    }

    public async generateSessionToken(this: DocumentType<User>): Promise<string> {

        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        const payload = {
            _id: this._id,
            email: this.UserName,
            exp: Math.floor(expiry.getTime() / 1000)
        }

        return await jwt.sign(payload, RSA_PRIVATE_KEY, { algorithm: 'RS256'});
    }

    public async verifySessionToken(this: DocumentType<User>, token: string) {

        const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
        return payload;
        
    }

    public async generateCsrfToken(this: DocumentType<User>) {
        const payload = await crypto.randomBytes(32).toString('hex');
        return payload;
    }
}


export const userModel = getModelForClass(User);