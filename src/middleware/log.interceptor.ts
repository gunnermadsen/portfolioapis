import { NextFunction, Request, Response } from 'express';
import { requestLogModel } from '../models/log.model';


export class LogInterceptorController {

    public static async logNetworkRequest(request: Request, response: Response, next: NextFunction): Promise<void> {
        
        // if (process.env.NODE_ENV === 'development') next()

        let data = {
            ip: request.ip,
            ips: request.ips,
            isSecure: request.secure,
            hostname: request.hostname,
            isXHR: request.xhr,
            cookies: request.cookies,
            url: request.url,
            method: request.method,
            protocol: request.protocol,
            subdomains: request.subdomains,
            baseUrl: request.baseUrl,
            originalUrl: request.originalUrl,
            timestamp: new Date()
        }

        try {
            await requestLogModel.create(data)

            next()
        } 
        catch (error) {
            next()
        }
    }
}