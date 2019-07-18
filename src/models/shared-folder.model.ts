import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from 'typegoose';

export class SharedFolders extends Typegoose {

    @prop({ required: true })
    public UserId: string;

    @prop({ required: true })
    public Path: string;

    @prop({ required: true })
    public Type: string;

    @prop({ required: true }) 
    public ShareName: string;

    @prop()
    public UserName: string;

    @prop({ required: true }) 
    public Invitees: string[];

    @prop()
    public Files: string[];

    @prop()
    public CreatedOn: Date;

    @prop()
    public EditedOn: Date;

}