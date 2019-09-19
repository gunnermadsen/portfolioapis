import * as cmd from 'node-cmd';
import * as fs from 'fs-extra';
import * as nodefs from 'fs';
import * as crypto from 'crypto';
import * as async from 'async';
import * as path from 'path';
import * as mime from 'mime';
import * as uuid from 'uuid'

import * as quicklookThumbnail from 'quicklook-thumbnail';
import * as prettyIcon from 'pretty-file-icons'

import { convertFile } from 'convert-svg-to-png'

import { Request, Response, response } from 'express';

import { Controller, Post, ClassMiddleware, Middleware, Get } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { SharedFolders } from '../../models/shared-folder.model';
import { Files, IFiles } from '../../models/files.model';
import { EntityTypes } from '../../models/entity.type';
import { IShare } from '../../models/share.model';
import { IEntity } from '../../models/entity.model';


const sharedFolderModel = new SharedFolders().getModelForClass(SharedFolders);
const filesModel = new Files().getModelForClass(Files)


@Controller('api/repo')
// @ClassMiddleware(JwtInterceptor.checkJWTToken)
export class RepositoryController {

    @Get('')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async getFolderContents(request: Request, response: Response): Promise<Response | void> {

        const userId = request.query.id
        const cwd = request.query.path
        
        if (!userId && !cwd) {
            return response.status(400).end()
        }

        try {

            const payload = await filesModel.find({ UserId: userId })

            const result = {
                result: payload[0].Files.length ? payload[0].Files : [{ Name: "No contents to display" }],

                settings: {
                    isEmpty: payload[0].Files.length ? true : false,
                    cwd: cwd
                }
            }

            return response.status(200).json(result)

        } 
        catch (error) {

            return response.status(500).json(error)

        }

    }


    @Post('create') // /:folder*?/:data*?
    @Middleware(JwtInterceptor.checkJWTToken)
    private createNewFolder(request: Request, response: Response): Response | void {

        const userId = response['user']._id
        const folderData: any = request.body.data;
        const cwd: string = path.join(__dirname, 'repository', userId, request.body.path, folderData.FolderName);

        let metadata: any = folderData.Accessibility === 1 ? { invitees: folderData.Invitees, owner: folderData.FolderName } : null

        if (fs.existsSync(cwd)) {
            return response.status(409).json({ message: "This folder name already exists" })
        }

        fs.mkdir(cwd, 0o755, (error: any) => {
            if (error) {
                return response.status(500).end()
            }
            else {
                const entity = {
                    originalName: folderData.FolderName,
                    cwd: request.body.path,
                    path: path.join(request.body.path, folderData.FolderName),
                    id: userId,
                    absPath: cwd,
                    type: EntityTypes.Folder,
                    meta: metadata,
                    icon: `/${folderData.Accessibility === 1 ? 'shared-folder' : 'folder'}.png`
                }

                this.createEntity(entity)

                return response.status(204).end()

                // this.getContentsOfFolder(request, response)
            }
        })

    }


    @Post('upload')
    // @Middleware(JwtInterceptor.checkJWTToken)
    private uploadFile(request: Request, response: Response): Response {

        if (!request.files[0]) {
            return response.status(404).json({ message: "No Files were present during upload" })
        }

        async.parallel([
            (callback: any) => {

                const uploads = path.resolve(request.files[0].path)

                nodefs.readFile(uploads, (error: any, data: any) => {
                    if (error) {
                        return response.status(400).json({ message: "An error occured when reading the file from the uploads folder", error: error })
                    }
                    else {
                        callback(null, data)
                    }
                })

            }
        ],
        (err: any, result: any) => {

            const cwd = path.join(__dirname, 'repository', request.body.userId, request.body.path, request.files[0].originalname)

            nodefs.writeFile(cwd, result[0], (error: any) => {
                if (error) {
                    return response.status(400).json({ message: "An error occured when writing the file to the folder", error: error })
                }
                else {
                    
                    cmd.run(`rm -rf ./uploads/${request.files[0].originalname.replace(/ /g, '\\\ ')}`)

                    this.createThumbnailFromFile(cwd, request.body.userId, request.files[0].originalname)

                    this.createEntity({ 
                        originalName: request.files[0].originalname, 
                        cwd: request.body.path, 
                        path: path.join(request.body.path, request.files[0].originalname),
                        id: request.body.userId, 
                        absPath: cwd, 
                        type: EntityTypes.File, 
                        meta: null,
                        
                    })

                    return response.status(204).end()
                }
            })
        })
    }


    @Post('delete')
    @Middleware(JwtInterceptor.checkJWTToken)
    private deleteItem(request: Request, response: Response) {

        const entities = request.body.entities

        const userId: string = request.body.id
        
        if (!entities) response.status(400).end()

        try {

            async.each(entities, async (entity: { name: string, path: string, type: string }, callback: Function) => {

                const cwd = path.join(__dirname, 'repository', userId, request.body.path, entity.name)

                if (entity.type === 'Folder') {

                    const exp = new RegExp(entity.path)

                    const outcome = await filesModel.updateMany({ UserId: userId }, { $pull: { Files: { Path: { $regex: exp } } } } )

                } 
                else {
                    const iconPath = path.resolve('thumbnails', userId, `${path.parse(entity.name).name}.png`) 

                    const deleteState = await filesModel.update( { UserId: userId }, { $pull: { Files: { Name: entity.name } } } )

                    await fs.remove(iconPath)
                }


                fs.remove(cwd, (error: any) => {
                    if (error) {
                        return response.status(500).json({ error: error })
                    }
                    else {
                        callback()
                    }
                })

            },
            (error: any) => {
                if (error) {
                    return response.status(500).json({ error: error })
                }
                else {
                    return response.status(201).json({ message: "Delete Operation Successful" })
                }
            })

        } 
        catch (error) {
            return response.status(500).json({ message: error })
        }
        
    }

    @Get('download')
    // @Middleware(JwtInterceptor.checkJWTToken)
    private downloadItem(request: Request, response: Response) {

        const dir = path.join(__dirname, 'repository', request.query.id, request.query.path, request.query.resource);

        const mimeType = mime.getType(request.query.resource);

        response.setHeader('Content-Type', mimeType);
        response.setHeader('Content-Transfer-Encoding', 'binary');
        response.setHeader('Content-disposition', `attachment; filename=${request.query.resource}`);

        response.download(dir);
                
    }

    @Post('verify')
    private verifyLink(request: Request, response: Response) {

        const { shareName, userName } = request.body

        this.validateShareUri(shareName, userName).then((share: any) => {
            if (share.status) {
                const folder = path.join(share.data.UserId, share.data.ShareName);

                response['user']._id = share.data.UserId;

                this.getFolderContents(request, response)
            }
            else {
                return response.status(404).json({ message: "We could not find the resource you specified" })
            }
        })
        .catch(error => {
            return response.status(500).json({ message: error });
        });
        
    }

    @Post('favorite')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async modifyFavorites(request: Request, response: Response): Promise<Response | void> {

        try {
            const { fileId, userId, state } = request.body

            const result = await filesModel.update({ UserId: userId, "Files.Id": fileId }, { $set: { "Files.$.IsFavorite": state }})

            if (result.nModified >= 1) {
                return response.status(200).json({ message: "Operation Successful" })
            }
            else {
                return response.status(400).end()
            }

        } 
        catch (error) {
            return response.status(500).json(error)

        }

    }

    @Post('rename')
    private async renameEntity(request: Request, response: Response): Promise<Response | void> {

        try {
            const { userId, entity } = request.body

            const result = await filesModel.update(
                { UserId: userId, "Files.Id": entity.changes.Id }, 
                { $set: { 
                    "Files.$.Name": entity.changes.Name, 
                    // "Files.$.Path": entity.changes.Path,
                    // "Files.$.ThumbnailPath": `/${userId}/${entity.changes.Name}` 
                } }
            )

            return response.status(200).json({ message: "Operation Successful" })

            // if (result.nModified >= 1) {
                
            // }
            // else {
            //     return response.status(400).end()
            // }

        }
        catch (error) {
            return response.status(500).json(error)

        }
    }

    private async createEntity(payload: IEntity): Promise<any> {

        try {

            // check for a duplicate
            const duplicate = await filesModel.find({ UserId: payload.id }, { Files: { $elemMatch: { Path: payload.path } } })

            if (duplicate[0].Files) {
                const result = await filesModel.update({ UserId: payload.id }, { $pull: { Files: { Name: payload.originalName } } })
            }

            const stats = await fs.stat(payload.absPath)

            const entity: IFiles = {
                Id: uuid.v4(),
                Name: payload.originalName,
                Type: payload.type,
                Size: stats.size,
                Cwd: payload.cwd,
                Path: payload.path,
                ThumbnailPath: payload.type === EntityTypes.File ? `/${payload.id}/${path.parse(payload.originalName).name}.png` : payload.icon,
                IsFavorite: false,
                IsShared: false,
                CreatedOn: new Date(),
                EditedOn: new Date(),
                ShareData: payload.meta,
                MetaData: payload.meta
            }

            await filesModel.updateOne(
                { UserId: payload.id },
                { $push: { Files: entity } }
            )

        }
        catch (error) {

            return response.status(500).end()

        }
    }


    private createThumbnailFromFile(source: string, id: string, file: string): void {

        let destination = path.resolve('thumbnails', id) 

        const options = {
            size: 256,
            folder: destination
        }

        quicklookThumbnail.create(source, options, async (error: any, result: any) => {
            if (error) {

                const icon = prettyIcon.getIcon(file, 'svg') 

                const sourcePath = path.resolve('node_modules/pretty-file-icons/svg', icon) 

                let outputFile: string = `${destination}/${path.parse(file).name}.png`//.replace(/\.\s/, ' ').split('.')[0]

                const settings = {
                    outputFilePath: outputFile,
                    width: 90,
                    height: 120
                }

                try {
                    const destPath = await convertFile(sourcePath, settings)

                    console.log("File Icon written to: " + destPath)

                } 
                catch (error) {
                    console.log(error)
                }

            }
            else {
                console.log("Thumbnail created at: " + result)
            }
        })
    }

    private async validateShareUri(shareName: string, userName?: string): Promise<Response | any> {

        try {
            let resource: IShare = {
                ShareName: shareName
            }

            if (userName) {
                resource.UserName = userName;
            }

            const share = await sharedFolderModel.findOne(resource);

            const result: any = {
                data: share,
                status: (share) ? true : false
            }

            return result;

        } catch (error) {
            return response.status(400).json({ message: error });
        }
        
    }

}







/**
 * Aggregate query operations:
 * 
 * Find Sub Documents using regular expression 
 * const result = await filesModel.aggregate([
        { $match: { UserId: userId }},
        { $unwind: "$Files" },
        { $match: { "Files.Path": { $regex: exp } } }
    ])
 */