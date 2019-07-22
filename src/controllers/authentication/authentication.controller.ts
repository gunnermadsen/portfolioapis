import { Request, Response } from 'express';
import { User } from '../../models/authentication.model';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as cmd from 'node-cmd';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';


// import { OK, BAD_REQUEST } from 'http-status-codes';

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

const UserModel = new User().getModelForClass(User);

@Controller('api/users') 
export class UserController {

    @Post('login')
    private async login(request: Request, response: Response): Promise<Response> {

        const userName = request.body.UserName;
        const password = request.body.Password;

        const user = await UserModel.findOne({ UserName: userName });

        try {

            if (user) {

                const hash = await user.validatePassword(password)
        
                if (user.Hash === hash && user.UserName === userName) {
                    
                    const { hash, ...userWithoutHash } = user.toObject();
                    const token = await user.generateSessionToken().catch(error => { throw `Unable to get token: ${error || null}` });

                    const csrfToken = await user.generateCsrfToken();

                    response.cookie("SESSIONID", token, { maxAge: 3600000, httpOnly: true, secure: false });
                    response.cookie("XSRF-TOKEN", csrfToken)

                    let result: any = {
                        Id: user.id,
                        UserName: user.UserName,
                        Email: user.Email,
                        Token: token,
                        CSRFToken: csrfToken
                    }

                    return response.status(200).json({ account: result });
        
                } else {
        
                    return response.status(400).json({
                        message: "Your username or password is incorrect"
                    })

                }
            } else {

                return response.status(400).json({
                    message: "Your username or password is incorrect."
                })
                
            }

        } catch (error) {
            return response.status(500).json({ message: "An error occured when processing your request", error: error });
        }
    }

    @Post('register')
    private async register(request: Request, response: Response): Promise<Response> {

        const userName = request.body.UserName;
        const email = request.body.Email;
        const password = request.body.Password;

        if (!userName || !email || !password) {
            return response.status(400).json({ message: "A username, email and password are required to create an account" })
        }

        try {

            if (await UserModel.findOne({ UserName: userName, Email: email })) {
                return response.status(400).json({
                    message: `The username or email you provided is already taken`
                });
            }

            const user = new UserModel();

            user.UserName = userName;
            user.Email = email;
            user.CreatedOn = new Date();
            user.EditedOn = new Date();
            user.ProfilePicture = null;

            user.Hash = await user.setPassword(password);

            if (await user.save()) {

                const cwd = path.join(__dirname, '..', 'coolshare', 'repository');
                const directory = path.join(cwd, user.id);
                const file: string = path.join(cwd, 'Getting Started.pdf').replace(/(\s+)/g, '\\$1');

                fs.mkdirSync(directory, 0o755);

                cmd.run(`cp -r ${file} ${directory}`);

                response.status(200).json({ message: "Your account has been created successfully" })

            }
        } catch (error) {
            return response.status(500).json({
                message: `An error occured ${error}`
            });
        }
    }


    @Get('logout')
    @Middleware(JwtInterceptor.checkJWTToken)
    private logout(request: Request, response: Response): Response {
        response.clearCookie("SESSIONID");
        response.clearCookie("XSRF-TOKEN");
        return response.status(200).json({ message: 'Logout Successful' });
    }
    

    @Get('')
    // @Middleware([middleware1, middleware2])
    private async getAll(request: Request, response: Response): Promise<Response> {
        Logger.Info(request.body, true);
        const user = await UserModel.find().select('-hash');

        return response.status(200).json({...user})
    }

    @Get(':id')
    private async getById(request: Request, response: Response, id: string): Promise<Response> {
        const user = await UserModel.findById(id).select('-hash');
        return response.status(200).json({...user});
    }

    @Put(':id')
    private async update(request: Request, response: Response, id: string, userParams: any): Promise<void> {

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
    private async delete(request: Request, response: Response, id: string): Promise<void> {
        Logger.Info(request.params, true);
        await UserModel.findByIdAndRemove(id);
    }
}