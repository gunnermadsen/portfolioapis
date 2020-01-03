import { prop, getModelForClass } from '@typegoose/typegoose';

export class Meeting {

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


export const meetingModel = getModelForClass(Meeting)
