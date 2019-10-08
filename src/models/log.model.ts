import { prop, Typegoose } from '@hasezoey/typegoose';

export class RequestLogs extends Typegoose {
    @prop()
    public ip: string

    @prop()
    public method: string

    @prop()
    public ips: string[]

    @prop()
    public isSecure: boolean

    @prop()
    public hostname: string

    @prop()
    public isXHR: boolean

    @prop()
    public cookies: any

    @prop()
    public url: string

    @prop()
    public baseUrl: string

    @prop()
    public originalUrl: string

    @prop()
    public timestamp: Date

    @prop()
    public protocol: string

    @prop()
    public subdomains: string[]

    @prop()
    public statusCode: number
}