import { prop, Typegoose } from '@hasezoey/typegoose';

export class Meeting extends Typegoose {

    @prop({ unique: true }) 
    public UserId: string

    @prop({ unique: true })
    public Code: number

    @prop({ unique: true })
    public MeetingId: string
    
    @prop({ unique: true }) 
    public Name: string
    
    @prop() 
    public Description: string
    
}