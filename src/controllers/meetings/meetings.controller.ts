import { Request, Response } from 'express';
import { Controller, Post, ClassMiddleware, Middleware, Get, Delete, Put } from '@overnightjs/core';
import { OnConnect, SocketController, ConnectedSocket, OnDisconnect, MessageBody, OnMessage, SocketRequest } from "socket-controllers";

import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { Meeting } from '../../models/meeting.model';
import { LogInterceptorController } from '../../middleware/log.interceptor';

const meetingModel = new Meeting().getModelForClass(Meeting)

@SocketController()
@Controller('api/meetings')
// @ClassMiddleware([JwtInterceptor.checkJWTToken, LogInterceptorController.logNetworkRequest])
export class MeetingsController {

    @OnConnect()
    public connection(@ConnectedSocket() socket: any, @SocketRequest() request: any): void {
        var connection = request.accept("json", request.origin)
        console.log("Client Connected", socket)
    }

    @OnDisconnect()
    public disconnect(@ConnectedSocket() socket: any): void {
        console.log("Client Disconnected", socket)
    }

    @OnMessage("test")
    public save(@ConnectedSocket() socket: any): void {
        
    }

    @OnMessage("json")
    public testMessage(@ConnectedSocket() socket: any, @SocketRequest() request: any): void {
        console.log("Message from client received")
        console.log(socket)
    }

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

}