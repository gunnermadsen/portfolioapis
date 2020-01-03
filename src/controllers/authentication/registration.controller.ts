import { Request, Response } from 'express';
import { User } from '../../models/authentication.model';
import * as bcrypt from 'bcrypt';
import { getModelForClass } from '@typegoose/typegoose';

export async function register(request: Request, response: Response) {

    const UserModel = getModelForClass(User);


    const u = new UserModel({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        username: request.body.username,
        password: request.body.password
    });

    const user = await UserModel.findOne({ username: request.body.username, password: request.body.password });

    if (user === null) {
        await u.save();
        response.status(201).json({ message: "Your account has been created successfully. Please login" })
    }
    else {
        response.status(409).json({ message: "General Conflict: Your username is already taken" })
    }

}