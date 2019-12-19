import { EntityTypes } from "./entity.type";

export interface IEntity {
    Name: string
    Cwd: string
    Path: string
    Id: string
    AbsPath: string
    Type: EntityTypes.Folder | EntityTypes.File
    Meta: { invitees: string[], owner: string, permission: boolean }
    Icon?: string
    IsShared: boolean
}