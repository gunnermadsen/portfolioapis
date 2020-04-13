import { Request, Response } from 'express';
import { Controller, Post, ClassMiddleware, Get } from '@overnightjs/core';

import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { LogInterceptorController } from '../../middleware/log.interceptor';
import { join } from 'path'
import { readdir } from 'fs-extra'

@Controller('api/playlist')
// @ClassMiddleware([JwtInterceptor.checkJWTToken, LogInterceptorController.logNetworkRequest])
export class StreamlyController {

    @Get('')
    public async fetchPlaylist(request: Request, response: Response): Promise<Response | void> {

        const userId = request.query.id

        if (!userId) {
            return response.status(400).end()
        }

        const dir = join(__dirname, 'repository', userId)

        try {

            const files = await readdir(dir)

            const playlist = files.filter(file => file !== '.DS_Store').map(file => ({ name: file }))

            return response.status(200).json(playlist)

        }
        catch (error) {
            return response.status(500).json({ message: "An error occured"})
        }
    }

}