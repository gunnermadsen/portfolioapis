import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from '@hasezoey/typegoose';
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as util from 'util';
import { Request, Response } from 'express';

export class UserImagesModel extends Typegoose {
    
    @prop()
    public ProfilePicture: any;

    @prop({ unique: true })
    public UserId: string;
}