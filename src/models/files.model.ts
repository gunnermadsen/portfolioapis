import { prop, Typegoose } from '@hasezoey/typegoose';

export class Files extends Typegoose {

    @prop()
    public Files: IFiles[];

    @prop()
    public UserId: string;

}


export interface IFiles {

    Id: string
    Name: string
    Type: string
    Size: number
    Cwd: string
    Path: string
    ThumbnailPath: string
    IsFavorite: boolean
    IsShared: boolean
    ShareData: any
    MetaData: any
    CreatedOn: Date
    EditedOn: Date

}