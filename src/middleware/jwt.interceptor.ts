import { User } from "../models/authentication.model"
import { Request, Response } from 'express'
import { NextFunction } from "express"
import { getModelForClass } from "@typegoose/typegoose"

const UserModel = getModelForClass(User)

export class JwtInterceptor {
    public static checkJWTToken(request: Request, response: Response, next: NextFunction): Response {

        let token = request.headers.authorization

        if (token) {

            const user = new UserModel()

            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length).trimLeft()
            }
            else {
                return response.status(400).json({ message: "An error occured while retrieving your information" })
            }

            response['user'] = user.verifySessionToken(token)

            next()

        } else {
            return response.status(400).json({ message: "A valid token is required to access this resource" })
        }

    }
}