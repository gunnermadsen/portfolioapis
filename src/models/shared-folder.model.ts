import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from 'typegoose';

export class SharedFolders extends Typegoose {
    
    @prop({ required: true }) 
    public name: string;

    @prop({ required: true }) 
    public invitees: string[];

    @prop({ required: true }) 
    public userId: string;

    @prop({ required: true })
    public path: string;

    @prop()
    public files: string[];

    @instanceMethod 
    public createSharedFolder(this: InstanceType<SharedFolders>, sharedFolderData: any): void {
        this.name = sharedFolderData.folderName;
        this.invitees = sharedFolderData.invitees;
        this.userId = sharedFolderData.userId;
        this.path = sharedFolderData.path;
    }

}