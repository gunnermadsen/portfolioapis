import { prop } from '@typegoose/typegoose';

export class UserImagesModel {
    
    @prop()
    public ProfilePicture: any;

    @prop({ unique: true })
    public UserId: string;
}