import { EntityTypes } from "./entity.type";

export interface IEntity {
    originalName: string
    cwd: string
    path: string
    id: string
    absPath: string
    type: EntityTypes.Folder | EntityTypes.File
    meta: { invitees: string[], owner: string, readOnly: boolean }
    icon?: string
    isShared: boolean
}