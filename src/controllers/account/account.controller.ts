import { Controller, Post, ClassMiddleware, Middleware, Get, Put, Delete, Patch } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { Request, Response } from 'express';
import { User } from '../../models/authentication.model';

const userModel = new User().getModelForClass(User);


@Controller('api/account')
@ClassMiddleware(JwtInterceptor.checkJWTToken)
export class AccountController {

    @Get('')
    private async getAccountInfoByToken(request: Request, response: Response): Promise<Response> {

        try {

            let user = await userModel.findById({ _id: response['user']._id })

            if (user) {

                let account = {
                    Id: user._id,
                    UserName: user.UserName,
                    Email: user.Email,
                    ProfilePicture: user.ProfilePicture,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                }

                return response.status(200).json({ account: account });
            }

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    }

    @Put(':id')
    private async updateProfileInfo(request: Request, response: Response): Promise<Response> {

        const account = request.body;

        const user = await userModel.findById({ _id: request.params.id });


        if (!account && !user) {
            return response.status(400).json({ message: "Profile information not found" });
        }

        try {
            const result = await userModel.update({ _id: request.params.id }, { $set: { ...account, EditedOn: new Date() }} );

            if (result) {
                return response.status(201).json({ message: "Your profile was updated successfully" });
            } 
            else {
                return response.status(500);
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }
}