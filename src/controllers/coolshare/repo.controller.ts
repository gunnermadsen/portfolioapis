import * as cmd from 'node-cmd'
import * as fs from 'fs-extra'
import * as nodefs from 'fs'

import * as async from 'async'
import * as path from 'path'
import * as mime from 'mime'
import * as uuid from 'uuid'
import * as archiver from 'archiver'
// import * as filepreview from 'filepreview-es6'
// import * as quicklookThumbnail from 'quicklook-thumbnail'
// import * as prettyIcon from 'pretty-file-icons'

// import { convertFile } from 'convert-svg-to-png'

import { Request, Response, response } from 'express'

// import { Thumbnail } from 'thumbnail'

// import * as Thumbnail from 'thumbnail'

import { Controller, Post, ClassMiddleware, Middleware, Get } from '@overnightjs/core'
import { JwtInterceptor } from '../../middleware/jwt.interceptor'
import { SharedFolders } from '../../models/shared-folder.model'
import { Files, IFile } from '../../models/files.model'
import { EntityTypes } from '../../models/entity.type'
import { IShare } from '../../models/share.model'
import { IEntity } from '../../models/entity.model'

import { LogInterceptorController } from '../../middleware/log.interceptor';
import { Logger } from '@overnightjs/logger'

const sharedFolderModel = new SharedFolders().getModelForClass(SharedFolders)
const filesModel = new Files().getModelForClass(Files)


@Controller('api/repo')
@ClassMiddleware(LogInterceptorController.logNetworkRequest)
export class RepositoryController {

    @Get('')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async getRepository(request: Request, response: Response): Promise<Response | void> {

        const { id, path } = request.query
        
        if (!id && !path) return response.status(400).end()

        try {

            const result = await this.readContents(request, response, id, path)

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
        const folderData: any = request.body.data
        const cwd: string = path.join(__dirname, 'repository', userId, request.body.path, folderData.FolderName)

        let metadata: { invitees: string[], owner: string, permission: boolean } = null
        let isShared: boolean = false
        let thumbnail: string = 'folder.png'

        if (fs.existsSync(cwd)) {
            return response.status(409).json({ message: "This folder name already exists" })
        }

        if (folderData.Accessibility === 1) {
            metadata = { 
                invitees: folderData.Invitees, 
                owner: folderData.UserName,
                permission: folderData.Permissions
            }
            isShared = true
            thumbnail = 'share-folder.png'
        }

        fs.mkdir(cwd, 0o755, async (error: any) => {
            if (error) {
                return response.status(500).end()
            }
            else {
                const entity = {
                    Name: folderData.FolderName,
                    Cwd: request.body.path,
                    Path: path.join(request.body.path, folderData.FolderName),
                    Id: userId,
                    AbsPath: cwd,
                    Type: EntityTypes.Folder,
                    Meta: metadata,
                    IsShared: isShared,
                    Icon: thumbnail
                }

                await this.createEntity(entity)

                return response.status(204).end()

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

                    // this.createThumbnailFromFile(cwd, request.body.userId, request.files[0].originalname)

                    this.createEntity({ 
                        Name: request.files[0].originalname, 
                        Cwd: request.body.path, 
                        Path: path.join(request.body.path, request.files[0].originalname),
                        Id: request.body.userId, 
                        AbsPath: cwd, 
                        Type: EntityTypes.File,
                        Meta: null,
                        IsShared: false,
                        Icon: `${path.parse(request.files[0].originalname).name}.png`
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

        const userId: string = request.body.userId
        
        if (!entities) response.status(400).end()

        try {

            async.each(entities, async (entity: any, callback: Function) => {

                const cwd = path.join(__dirname, 'repository', userId, request.body.path, entity.name)

                if (entity.type === 'Folder') {

                    const exp = new RegExp(entity.path)

                    const outcome = await filesModel.updateMany({ UserId: userId }, { $pull: { Files: { Path: { $regex: exp } } } })

                }
                else {
                    const iconPath = path.resolve('thumbnails', userId, `${path.parse(entity.name).name}.png`)

                    const deleteState = await filesModel.update({ UserId: userId }, { $pull: { Files: { Name: entity.name } } })

                    const iconDeleteState = await fs.remove(iconPath)
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
                    return response.status(201).end()
                }
            })

        }
        catch (error) {
            return response.status(500).json({ message: error })
        }

    }

    @Get('download')
    // @Middleware(JwtInterceptor.checkJWTToken)
    public downloadItem(request: Request, response: Response): void {

        let resource: string
        let entityPath: string

        const prepareAndSendDownload = (resource, dir) => {
            const mimeType = mime.getType(resource)

            response.setHeader('Content-Type', mimeType)
            response.setHeader('Content-Transfer-Encoding', 'binary')
            response.setHeader('Content-disposition', `attachment filename=${resource}`)

            response.download(dir)
        }

        switch (request.query.type) {
            case "Folder":
                resource = `${request.query.resource}.zip`
 
                const outputFolderPath = path.join(__dirname, 'temp', request.query.id)
                const inputFolderPath = path.join(__dirname, 'repository', request.query.id, request.query.path, request.query.resource)

                entityPath = path.join(outputFolderPath, resource)

                fs.mkdir(outputFolderPath, (error: NodeJS.ErrnoException) => {
                    if (error) {
                        return response.status(500).json(error)
                    } else {
                        const output = fs.createWriteStream(entityPath)

                        const archive = archiver('zip', { zlib: { level: 9 } })

                        output.on('end', () => {
                            return console.log("Data has been drained")
                        })

                        output.on('close', async () => {
                            Logger.Info("Operation Completed")
                            prepareAndSendDownload(resource, entityPath)
                            await fs.remove(outputFolderPath)
                        })

                        archive.on('warning', (warning) => {
                            if (warning.code === 'ENOENT') {
                                console.warn(warning)
                            } else {
                                throw warning
                            }
                        })
                        archive.on('error', (error) => {
                            throw error
                        })
                        archive.on('progress', (progress: archiver.ProgressData) => {
                            console.log(Math.floor(progress.entries.processed / progress.entries.total * 100), '%')
                        })

                        archive.pipe(output)

                        archive.directory(`${inputFolderPath}/`, false) //request.query.resource
                        archive.finalize()

                    }
                })
                
                break

            case "File":
                entityPath = path.join(__dirname, 'repository', request.query.id, request.query.path, request.query.resource)
                prepareAndSendDownload(request.query.resource, entityPath)
                break
        }
                
    }

    @Post('favorite')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async modifyFavorites(request: Request, response: Response): Promise<Response | void> {

        try {
            const { fileId, userId, state } = request.body

            const exists = await filesModel.find({ UserId: userId, "Files.Id": fileId })

            if (!exists[0].Files) {
                return response.status(404).end()
            }

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
    // @Middleware(JwtInterceptor.checkJWTToken)
    private async renameEntity(request: Request, response: Response): Promise<Response | void> {

        const { userId, entity, cwd } = request.body

        let files: IFile[] = []

        let batchUpdateResult: any
        let fileUpdateResult: any

        let entityCwd = path.join(__dirname, 'repository', userId, cwd)

        try {

            if (entity.type === 'File') {

                fileUpdateResult = await filesModel.update(
                    { UserId: userId, "Files.Id": entity.id },
                    { $set: { 
                        "Files.$.Name": entity.newName, 
                        "Files.$.Path": path.join(cwd, entity.newName), 
                        "Files.$.ThumbnailPath": path.join(userId, entity.newName),
                        "Files.$.EditedOn": new Date()
                    } }
                )

            }
            else {

                const exp = new RegExp(entity.path)

                // how many layers down into the folder hierarchy do we perform the replacement?
                let pathLayer: number = entity.path.split('/').length - 1
                let cwdLayer: number = cwd.split('/').length

                if (cwd === "/") cwdLayer -= 1

                let documents = await filesModel.aggregate([
                    { $match: { UserId: userId } },
                    { $unwind: { path: "$Files" } },
                    { $match: { "Files.Path": { $regex: exp } } }
                ])

                if (!documents.length) return response.status(500).json({ message: "0 results found"})

                documents.forEach(async (document: any, index: number) => {
                    let file: IFile = document.Files
                    let pathTree = file.Path.split('/')
                    let cwdTree = file.Cwd.split('/')

                    pathTree[pathLayer] = entity.newName
                    file.Path = pathTree.toString().replace(/,/g, '/')
                    file.EditedOn = new Date()

                    if (index > 0) {
                        cwdTree[cwdLayer] = entity.newName
                        file.Cwd = cwdTree.toString().replace(/,/g, '/')
                    }

                    if (file.Id === entity.id) {
                        file.Name = entity.newName
                    }

                    files.push(file)

                    try {
                        const updateResult = await filesModel.update({ UserId: userId }, { $pull: { Files: { Id: file.Id } } })
                    }
                    catch (error) {
                        return response.status(500).json(error)
                    }

                })

                batchUpdateResult = await filesModel.update({ UserId: userId }, { $push: { Files: { $each: files } } })

            }

            fs.rename(path.join(entityCwd, entity.oldName), path.join(entityCwd, entity.newName), (error: NodeJS.ErrnoException) => {
                if (error) {
                    return response.status(500).json(error)
                }
                return response.status(204).end()
            })

        }
        catch (error) {
            return response.status(500).json(error)

        }
    }

    @Post('verify')
    private async verifyLink(request: Request, response: Response) {

        const { shareName, userName } = request.body

        if (!shareName && !userName) {
            return response.status(400).end()
        }

        try {
            const share = await this.validateShareUri(shareName, userName)

            if (!share.status) {
                return response.status(404).end()
            }

            const entity = share.data[0]

            const contents = await this.readContents(request, response, entity.UserId, entity.Files.Path)

            const files = contents.result.filter((file: any) => file.Path === entity.Files.Path)

            return response.status(200).json({ 
                files: files,
                userId: entity.UserId,
                userName: entity.Files.Meta.owner,
                settings: contents.settings
            })

        } catch (error) {
            return response.status(500).end()
        }
    }

    private async createEntity(payload: IEntity): Promise<void | Request> {

        try {

            // check for a duplicate
            const duplicate = await filesModel.find({ UserId: payload.Id }, { Files: { $elemMatch: { Path: payload.Path } } })

            if (duplicate[0].Files) {
                const result = await filesModel.update({ UserId: payload.Id }, { $pull: { Files: { Name: payload.Name } } })
            }

            const stats = await fs.stat(payload.AbsPath)

            const entity: IFile = {
                ...payload,
                Id: uuid.v4(),
                Size: stats.size,
                ThumbnailPath: payload.Type === EntityTypes.File ? `/${payload.Id}/${path.parse(payload.Name).name}.png` : payload.Icon,
                IsFavorite: false,
                CreatedOn: new Date(),
                EditedOn: new Date(),
            }

            await filesModel.updateOne(
                { UserId: payload.Id },
                { $push: { Files: entity } }
            )

        }
        catch (error) {

            return response.status(500).end()

        } 
    }

    private prepareAndSendDownload(resource: string, dir: string): void {
        const mimeType = mime.getType(resource)

        response.setHeader('Content-Type', mimeType)
        response.setHeader('Content-Transfer-Encoding', 'binary')
        response.setHeader('Content-disposition', `attachment filename=${resource}`)

        response.download(dir)
    }


    private async createThumbnailFromFile(source: string, id: string, file: string): Promise<void> {

        const deleteFolder = async () => await fs.remove(tempDir)

        let destination = `${path.resolve('thumbnails', id)}/${path.parse(file).name}.png`
        const tempDir = path.join(__dirname, 'temp', id)

        try {

            
            await fs.mkdir(tempDir)

            const options = {
                // width: 200,
                // height: 200,
                quality: 100,
                // flatten: true,
                background: '#fff',
                // pagerange: '1-3'
                pdf: false,
                keepAspect: true,
                pdf_path: tempDir
            }

            // await filepreview
            //     .generateAsync(source, destination, options)
                // .then(result => {
                //     return console.log("Operation Successful")
                // })
                // .catch(error => {
                //     return console.error(error)
                // })

            deleteFolder()

        } catch (error) {

            deleteFolder()
            console.log(error)
            // TODO: set a default image 
            return 
        }
    }

    // private createThumbnailInProduction(source: string, destination: string, file: string): void {

    //     let thumbnail = new Thumbnail(source, destination)

    //     thumbnail.ensureThumbnail(file, 90, 120, (error: any, filename: string) => {
    //         if (error) {
    //             this.createThumbnailFromSvg(destination, file)
    //         }
    //         else {
    //             console.log("Thumbnail created at: " + filename)
    //         }
    //     })
    // }

    // private createThumbnailInDevelopment(source: string, file: string, destination: string): void {

    //     const options = {
    //         size: 256,
    //         folder: destination
    //     }

    //     quicklookThumbnail.create(source, options, (error: any, result: any) => {
    //         if (error) {
    //             this.createThumbnailFromSvg(destination, file)
    //         }
    //         else {
    //             console.log("Thumbnail created at: " + result)
    //         }
    //     })
    // }

    // private async createThumbnailFromSvg(destination: string, file: string): Promise<void> {
    //     const icon = prettyIcon.getIcon(file, 'svg')

    //     const sourcePath = path.resolve('node_modules/pretty-file-icons/svg', icon)

    //     let outputFile: string = `${destination}/${path.parse(file).name}.png`//.replace(/\.\s/, ' ').split('.')[0]

    //     const settings = {
    //         outputFilePath: outputFile,
    //         width: 90,
    //         height: 120
    //     }

    //     try {
    //         const destPath = await convertFile(sourcePath, settings)

    //         console.log("File Icon written to: " + destPath)

    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    private async readContents(request: Request, response: Response, id: string, path: string): Promise<any> {
        try {
            const entities = await filesModel.find({ UserId: id })

            const result = {
                result: entities[0].Files.length ? entities[0].Files : [], //{ Name: "No contents to display", Cwd: path, Id: uuid.v4() }

                settings: {
                    isEmpty: entities[0].Files.length ? false : true,
                    cwd: path
                }
            }
            return result

        } catch (error) {
            return response.status(500).end()
        }
    }

    private async validateShareUri(shareName: string, userName?: string): Promise<Response | any> {

        try {
            const share = await filesModel.aggregate([
                { $unwind: { path: "$Files" } },
                { $match: { 
                    "Files.Name": shareName,
                    "Files.Meta.owner": userName,
                    "Files.IsShared": true
                } }
            ])

            const result: any = {
                data: share,
                status: (share) ? true : false
            }

            return result

        } catch (error) {
            return response.status(400).json({ message: error })
        }
        
    }

}