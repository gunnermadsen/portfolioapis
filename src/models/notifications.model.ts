import { prop, getModelForClass } from '@typegoose/typegoose';

export class Notifications {
    
    @prop()
    public Notifications: Notifications[];

    @prop()
    public UserId: string;

    @prop()
    public NotificationBadgeHidden: boolean;

}

export const notificationModel = getModelForClass(Notifications);
