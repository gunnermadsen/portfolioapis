import { prop, getModelForClass } from '@typegoose/typegoose';

export class Files {

    @prop()
    public Files?: IFile[];

    @prop()
    public UserId?: string;

}


export interface IFile {

    Id?: string
    Name?: string
    Type?: string
    Size?: number
    Cwd?: string
    Path?: string
    ThumbnailPath?: string
    IsFavorite?: boolean
    IsShared?: boolean
    ShareData?: any
    MetaData?: any
    CreatedOn?: Date
    EditedOn?: Date

}

export const filesModel = getModelForClass(Files)
