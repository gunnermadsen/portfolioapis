import { Request, Response, response } from 'express';
import { User } from '../../models/authentication.model';
import * as bcrypt from 'bcrypt';

// import { OK, BAD_REQUEST } from 'http-status-codes';

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

const UserModel = new User().getModelForClass(User);

@Controller('api/users') 
export class UserController {

    @Post('login')
    private async login(request: Request, response: Response) {

        const UserName = request.body.UserName;
        const Password = request.body.Password;

        const user = await UserModel.findOne({ UserName });

        try {

            if (user) {

                const hash = await user.validatePassword(Password)
        
                if (user.Hash === hash && user.UserName === UserName) {

                    
                    const { hash, ...userWithoutHash } = user.toObject();
                    const token = await user.generateSessionToken(user.id).catch(error => { throw `Unable to get token: ${error || null}` });

                    response.cookie("SESSIONID", token, { maxAge: 3600000, httpOnly: true, secure: false });

                    let result: any = {
                        Id: user.id,
                        UserName: user.UserName,
                        Token: token
                    }

                    return response.status(200).json(result);

                    
        
                } else {
        
                    return response.status(400).json({
                        message: "Your username or password is incorrect"
                    })
                }
            } else {

                return response.status(500).json({
                    message: "An error occured when processing your request"
                })
            }

        } catch (error) {
            return response.status(500).json({ message: "An error occured when processing your request", username: request.body.UserName, password: request.body.Password, error: error });
        }
    }
    

    @Get('')
    // @Middleware([middleware1, middleware2])
    private async getAll(request: Request, response: Response) {
        Logger.Info(request.body, true);
        const user = await UserModel.find().select('-hash');

        return response.status(200).json({...user})
    }

    @Get(':id')
    private async getById(request: Request, response: Response, id: string) {
        const user = await UserModel.findById(id).select('-hash');
        return response.status(200).json({...user});
    }


    @Post('register')
    private async create(userParams: any) {
        if (await UserModel.findOne({ UserName: userParams.UserName })) {
            return response.status(400).json({
                message: `${userParams.UserName} is already taken`
            });
        }

        const user = new UserModel(userParams);

        if (userParams.Password) {
            //user.hash = bcrypt.hashSync(userParams.password, 10);
            user.Hash = user.setPassword(userParams.Password);
        }

        if (await user.save()) {
            return response.status(200).json({
                message: "Your account has been created successfully"
            })
        }
    }


    @Put('/:id')
    private async update(request: Request, response: Response, id: string, userParams: any) {

        Logger.Info(request.body);
        const user = await UserModel.findById(id);

        if (!user) throw 'User not found';

        if (user.UserName !== userParams.UserName && await UserModel.findOne({ UserName: userParams.UserName })) {
            throw + userParams.UserName + ' is already taken';
        }

        if (userParams.password) {
            userParams.hash = bcrypt.hashSync(userParams.password, 10);
        }

        Object.assign(user, userParams);

        await user.save();
    }


    @Delete('delete/:id')
    private async delete(request: Request, response: Response, id: string) {
        Logger.Info(request.params, true);
        await UserModel.findByIdAndRemove(id);
    }
}