import { Request, Response } from 'express';
import { Controller, Post, ClassMiddleware, Middleware, Get, Delete, Put } from '@overnightjs/core';

import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { Meeting } from '../../models/meeting.model';
import { LogInterceptorController } from '../../middleware/log.interceptor';

const meetingModel = new Meeting().getModelForClass(Meeting)

@Controller('api/meetings')
@ClassMiddleware([JwtInterceptor.checkJWTToken, LogInterceptorController.logNetworkRequest])
export class MeetingsController {

    @Post('new')
    public async createMeeting(request: Request, response: Response): Promise<Response | void> {

        const meeting = request.body 

        if (!meeting) {
            return response.status(400).end()
        }

        try {
            const result = await meetingModel.create(meeting)

            return response.status(200).json(result)
        } 
        catch (error) {
            return response.status(500).end()
        }

    }


    @Get('')
    public async fetchMeetings(request: Request, response: Response): Promise<Response | void> {

        const userId = request.query.id

        if (!userId) {
            return response.status(400).end()
        }

        try {

            const meetings = await meetingModel.find({ UserId: userId })

            return response.status(200).json(meetings)

        } 
        catch (error) {
            return response.status(500).end()
        }
    }

    @Post('verify')
    public async verifyMeeting(request: Request, response: Response): Promise<Response | void> {
        
        const code = request.body.code

        if (!code) {
            return response.status(400).end()
        }

        try {
            const meeting = await meetingModel.find({ Code: code })

            return response.status(200).json(meeting)
        }
        catch (error) {
            return response.status(500).end()
        }
    }

}