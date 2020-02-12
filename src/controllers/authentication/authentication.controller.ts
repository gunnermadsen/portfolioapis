import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as cmd from 'node-cmd';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';

import { Controller, Middleware, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { LogInterceptorController } from '../../middleware/log.interceptor';
import { userModel } from '../../models/authentication.model';
import { notificationModel } from '../../models/notifications.model';



@Controller('api/users')
@ClassMiddleware(LogInterceptorController.logNetworkRequest)
export class UserController {

    @Post('login')
    public async login(request: Request, response: Response): Promise<Response> {

        const { UserName, Password } = request.body

        try {

            const user = await userModel.findOne({ UserName: UserName });

            if (user) {

                const hashesDoMatch = user.validatePassword(Password)
        
                if (hashesDoMatch && user.UserName === UserName) {
                    
                    const { hash, ...userWithoutHash } = user.toObject();
                    const token = user.generateSessionToken() //.catch(error => { throw `Unable to get token: ${error || null}` });

                    const csrfToken = user.generateCsrfToken();

                    response.cookie("SESSIONID", token, { maxAge: 3600000, httpOnly: true, secure: false });
                    response.cookie("XSRF-TOKEN", csrfToken)

                    const result = {
                        JWTToken: token,
                        CSRFToken: csrfToken,
                        Id: user.id,
                        UserName: UserName
                    }

                    return response.status(200).json(result);
        
                } else {
        
                    return response.status(400).json({
                        message: "Your username or password is incorrect.",
                        status: 400
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
    public async register(request: Request, response: Response): Promise<Response> {

        const userName = request.body.UserName;
        const email = request.body.Email;
        const password = request.body.Password;

        if (!userName || !email || !password) {
            return response.status(400).json({ message: "A username, email and password are required to create an account" })
        }

        try {

            const duplicate = await userModel.find(
                {
                    $or: [
                        { UserName: userName }, 
                        { Email: email }
                    ]
                }
            )

            if (duplicate.length) {
                return response.status(400).json({
                    message: `The username or email you provided is already taken`
                });
            }

            const user = new userModel();

            user.UserName = userName;
            user.Email = email;
            user.FirstName = null;
            user.LastName = null;
            user.CreatedOn = new Date();
            user.EditedOn = new Date();
            user.ProfilePicture = null;

            user.Hash = user.setPassword(password);

            const result = await userModel.create(user);

            if (result) {

                const cwd = path.join(__dirname, '..', 'coolshare', 'repository');
                const directory = path.join(cwd, user.id);
                const file: string = path.join(cwd, 'Getting Started.pdf').replace(/(\s+)/g, '\\$1');

                const userNotificationModel: any = {
                    Notifications: [],
                    UserId: result._id,
                    NotificationBadgeHidden: true
                }

                const notification = await notificationModel.create(userNotificationModel)

                fs.mkdirSync(directory, 0o755)
                fs.mkdirSync(`thumbnails/${user.id}`)

                cmd.run(`cp -r ${file} ${directory}`)
                cmd.run(`cp thumbnails/"Getting Started.png" thumbnails/${user.id}`)

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
    public logout(request: Request, response: Response): Response {
        response.clearCookie("SESSIONID");
        response.clearCookie("XSRF-TOKEN");
        return response.status(200).json({ message: 'Logout Successful' });
    }
    

    @Get('')
    @Middleware(JwtInterceptor.checkJWTToken)
    // @Middleware([middleware1, middleware2])
    public async getAll(request: Request, response: Response): Promise<Response | void> {

        try {
            const user = await userModel.find({}).select('-hash');
            return response.status(200).json({...user})

        } catch (error) {
            return response.status(500).end()
        }

    }

    @Get(':id')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async getById(request: Request, response: Response, id: string): Promise<Response | void> {

        try {

            const user = await userModel.findById(id).select('-hash');

            return response.status(200).json({ ...user });

        } 
        catch (error) {

            return response.status(500).end()

        }

    }

    @Put(':id')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async update(request: Request, response: Response, id: string, userParams: any): Promise<void> {

        try {

            const user = await userModel.findById(id);
    
            if (!user) throw 'User not found';
    
            if (user.UserName !== userParams.UserName && await userModel.findOne({ UserName: userParams.UserName })) {
                throw + userParams.UserName + ' is already taken';
            }
    
            if (userParams.password) {
                userParams.hash = bcrypt.hashSync(userParams.password, 10);
            }
    
            Object.assign(user, userParams);
    
            await user.save();

            return response.status(200).end()


        } catch(error) {
            return response.status(500).end()
        }

    }


    @Delete('delete/:id')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async delete(request: Request, response: Response, id: string): Promise<void> {
        try {
            const result = await userModel.findByIdAndRemove(id);

            if (result) {
                return response.status(200).end()
            }

        } catch (error) {
            return response.status(500).end()
        }
    }
}