import { User } from "../models/authentication.model";
import { Request, Response } from 'express';
import { NextFunction } from "express";

const UserModel = new User().getModelForClass(User);

export class JwtInterceptor {
    public static async checkJWTToken(request: Request, response: Response, next: NextFunction) {

        let token = request.headers.authorization;

        if (token) {
            const user = new UserModel();
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length).trimLeft();
            }
            else {
                response.status(401).json({ message: "Invalid Token" })
            }

            await user.verifySessionToken(token)
                .then((data: any) => {
                    response['user'] = data;
                    next();
                })
                .catch((error: any) => {
                    return response.status(401).json({ error: error });
                })

        } else {
            return response.status(401).json({ message: "A valid token is required to access this resource", status: 401 })
        }
        
    }
}