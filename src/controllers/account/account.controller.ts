import { Controller, Post, ClassMiddleware, Middleware, Get, Put, Delete, Patch } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { Request, Response } from 'express';
import { User } from '../../models/authentication.model';
import { UserImagesModel } from '../../models/user-images.model';

const userModel = new User().getModelForClass(User);

const userImagesModel = new UserImagesModel().getModelForClass(UserImagesModel);


@Controller('api/account')
@ClassMiddleware(JwtInterceptor.checkJWTToken)
export class AccountController {

    @Get('')
    private async getAccountInfoByToken(request: Request, response: Response): Promise<Response> {

        try {

            let user = await userModel.findById({ _id: response['user']._id })
            let picture = await userImagesModel.findById({ _id: response['user']._id })

            if (user) {

                // let image = Buffer.from(picture.ProfilePicture);
                
                let account = {
                    Id: user._id,
                    UserName: user.UserName,
                    Email: user.Email,
                    ProfilePicture: picture,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                }

                return response.status(200).json({ account: account });
            }

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    }

    @Post('picture')
    private async saveAccountPicture(request: Request, response: Response): Promise<Response> {
        
        try {

            const base64Image = Buffer.from(request.body.picture);

            const user = await userImagesModel.findByIdAndUpdate({ _id: response['user']._id }, base64Image);

            if (user) {
                return response.status(200).json({ message: "Your picture was saved successfully" });
            } 
            else {
                return response.status(400).json({ message: "An error occured when trying to save your profile picture" })
            }

        } catch {
            return response.status(500).json({ message: "An error occured while trying to save your profile picture" });
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