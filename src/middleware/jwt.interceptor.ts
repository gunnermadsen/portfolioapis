import { User } from "../models/authentication.model";
import { Request, Response } from 'express';
import { NextFunction } from "express";

const UserModel = new User().getModelForClass(User);

export class JwtInterceptor {
    public static checkJWTToken(request: Request, response: Response, next: NextFunction): Response {

        let token = request.headers.authorization;

        if (token) {

            const user = new UserModel();

            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length).trimLeft();
            }
            else {
                response.status(400).json({ message: "Invalid Token" })
            }

            user.verifySessionToken(token).then((data: any) => {
                response['user'] = data;
                next();
            })
            .catch((error: any) => {
                return response.status(401).json({ error: error });
            })

        } else {
            return response.status(400).json({ message: "A valid token is required to access this resource" })
        }

    }
}