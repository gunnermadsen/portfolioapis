import { User } from "../../../models/authentication.model";
import { Request, Response } from 'express';
import { NextFunction } from "connect";

const UserModel = new User().getModelForClass(User);

export class JwtInterceptor {
    public static checkJWTToken(request: Request, response: Response, next: NextFunction) {

        let token = request.headers.authorization;
        const user = new UserModel();
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        } 
        else {
            response.status(401).json({ message: "Invalid Token" })
        }

        user.verifySessionToken(token)
            .then((data: any) => {
                response['user'] = data;
                next();
            })
            .catch((error: any) => {
                return response.status(401).json({ error: error });
            })

    }
}