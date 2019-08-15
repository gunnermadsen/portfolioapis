import { prop, Typegoose } from 'typegoose';

export class Notifications extends Typegoose {
    @prop()
    public Notifications: any;

    @prop()
    public UserId: string;

    @prop()
    public NotificationBadgeHidden: boolean;

}