
import { Request, Response } from 'express';
import { Controller, Post, ClassMiddleware, Middleware, Get, Delete, Put } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';

import { Notifications } from '../../models/notifications.model';

const notificationModel = new Notifications().getModelForClass(Notifications);



@Controller('api/notifications')
// @ClassMiddleware(JwtInterceptor.checkJWTToken)
export class NotificationController {


    @Get('')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async getNotifications(request: Request, response: Response) {

        const id = request.query.id;

        if (!id) {
            return response.status(400).end();
        }

        try {

            const data = await notificationModel.find({ UserId: id });

            let result = { ...data[0].toObject() }

            return response.status(200).json(result);

        } catch (error) {

            return response.status(500).json(error);

        }
    }

    @Post('create')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async createNotification(request: Request, response: Response) {

        const userId = request.body.userId;

        if (!userId) {
            return response.status(400).end();
        }

        try {
            let model = await notificationModel.find({ UserId: userId })

            if (!model) {
                return response.status(404).end()
            }
    
            const notification = {
                id: request.body.id,
                // type: request.body.notificationType,
                title: request.body.title,
                notificationType: request.body.notificationType,
                options: request.body.options,
                createdOn: new Date(),
                editedOn: new Date()
            }
    
            const data = await notificationModel.updateOne(
                {
                    UserId: userId 
                },
                {
                    $push: {
                        Notifications: notification
                    },
                    $set: {
                        NotificationBadgeHidden: false
                    }
                }
            );
            
            if (data) {
                return response.status(201).json({ notifications: notification, notificationBadgeHidden: false });
            } 
            else {
                return response.status(404).end()
            }

        } catch (error) {

            return response.status(500).json(error);

        }
    }

    @Delete('deleteall/:id')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async deleteAllNotifications(request: Request, response: Response) {

        const id = request.params.id;

        if (!id) {
            return response.status(400).json()
        }

        try {
            const model = await notificationModel.find({ UserId: id })

            if (!model.length) {
                return response.status(404).end()
            }

            const result = await notificationModel.updateOne(
                { UserId: id }, 
                { 
                    $pull: { 
                        Notifications: { }
                    },
                    $set: {
                        NotificationBadgeHidden: true
                    }
                },
                { multi: true }
            )


            if (result.nModified >= 1) {
                return response.status(204).end()
            }
            else {
                return response.status(500).end()
            }
            
        } catch (error) {
            return response.status(500).end()
        }
    }

    @Put('update/:id')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async updateNotificationStatus(request: Request, response: Response): Promise<Response | void> {

        const id: string = request.params.id

        const notificationId = request.body.notificationId

        const status = request.body.status

        if (!id) {
            return response.status(400).end()
        }

        try {

            const state = await notificationModel.updateOne(
                { 
                    UserId: id, 
                    "NotificationId": notificationId 
                },
                { 
                    $set: {
                        status: status
                    }
                }
            )

            if (state.ok === 1) {
                return response.status(204).end()
            }
            else {
                return response.status(500).end()
            }

        }
        catch (error) {
            return response.status(500).end()
        }
    }


    @Put(':id')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async setNotificationBadgeState(request: Request, response: Response): Promise<Response | void> {

        const id: string = request.params.id

        const viewState = request.body.state

        if (!id) {
            return response.status(400).end()
        }

        try {
            const model = await notificationModel.find({ UserId: id })

            if (!model) {
                return response.status(404).end()
            }

            const state = await notificationModel.updateOne(
                {
                    UserId: id
                }, 
                { 
                    $set: {
                        NotificationBadgeHidden: viewState 
                    }
                }
            )

            if (state.ok === 1) {
                return response.status(204).end()
            }
            else {
                return response.status(500).end()
            }


        } catch (error) {

            return response.status(500).end()

        }

    }


}