import { prop, Typegoose } from '@hasezoey/typegoose';

export class Notifications extends Typegoose {
    @prop()
    public Notifications: Notifications[];

    @prop()
    public UserId: string;

    @prop()
    public NotificationBadgeHidden: boolean;

}
