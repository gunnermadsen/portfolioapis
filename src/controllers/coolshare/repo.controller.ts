import { Request, Response, response } from 'express';
import * as multer from 'multer';
import * as cmd from 'node-cmd';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import * as async from 'async';

import { Controller, Post, ClassMiddleware, Middleware, Get } from '@overnightjs/core';
import * as path from 'path';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { SharedFolders } from '../../models/shared-folder.model';

import * as mime from 'mime';
import { NextFunction } from 'connect';

const sharedFolderModel = new SharedFolders().getModelForClass(SharedFolders);

export interface IShare {
    UserName?: string;
    ShareName: string;
}


export interface IPublicShare {
    UserId: string;
    Path: string;
    Type: string;
    ShareName: string;
    UserName: string;
    Invitees: string[]
    Files: any;
    CreatedOn: Date
    EditedOn: Date
}

@Controller('api/repo')
// @ClassMiddleware(JwtInterceptor.checkJWTToken)
export class RepositoryController {


    @Post('') //:folder*?
    @Middleware(JwtInterceptor.checkJWTToken)
    private getFolderContents(request: Request, response: Response, readPath?: any) {

        let results: any[] = [];

        let userId = response['user']._id;

        let urn: string = request.body.path;
        let filePath: string;
        let cwd: string;

        if (readPath && typeof readPath === 'string') {
            cwd = path.join(__dirname, 'repository', readPath)
        } 
        else {
            cwd = path.join(__dirname, 'repository', userId, urn);
        }

        fs.readdir(cwd, (error: any, list: any[]) => {

            if (error) {
                return response.status(404).json({ message: error })
            }

            if (list.length == 0) {

                const name = "No Contents to Display";

                results.push({
                    id: crypto.createHash('md5').update(name).digest('hex'),
                    name: name,
                    cwd: (typeof readPath === 'string') ? readPath : path.join(request.body.path),
                    empty: true,
                });

                return response.status(200).json({ content: results, userId: userId });
            }

            let pending = list.length;

            if (!pending) {
                return response.status(201).json(results);
            }

            list.forEach((file: string, index: number) => {

                filePath = path.resolve(cwd, file);

                fs.stat(filePath, async (err: any, stat: any): Promise<Response> => {

                    // let base = (!stat.isDirectory()) ? new Buffer(fs.readFileSync(path.join(cwd, file)).toString(), 'base64').toString('ascii') : false;

                    if (error) {
                        return response.status(404).json({ message: err })
                    }
                    
                    let pathName = request.body.path ? request.body.path : request.body.shareName;
                    let userName = request.body.userName ? request.body.userName : null;

                    let resource = userName ? pathName : file;
                    
                    const sharedStatus = await this.validateShareUri(resource, userName);

                    results.push({
                        id: crypto.createHash('md5').update(file).digest('hex'),
                        index: index,
                        name: file,
                        type: (stat.isDirectory()) ? "Folder" : "File",
                        size: stat.size + " Bytes",
                        creationDate: stat.birthtime,
                        cwd: path.join('/', pathName),
                        empty: false,
                        isShared: sharedStatus.status,
                        path: path.join(pathName, list[index]),
                    });

                    if (!--pending) {
                        return response.status(200).json({ 
                            content: results, 
                            userId: userId, 
                            userName: userName 
                        });
                    }
                    
                });
            });
        });    
    }


    @Post('create') // /:folder*?/:data*?
    @Middleware(JwtInterceptor.checkJWTToken)
    private async createNewFolder(request: Request, response: Response, id: string): Promise<Response | void> {
        // - rwx r-x r-x
        
        // owner: 7 - unlimited execution permissions as directory owner
        // group: 5 - restrict write permissions in group
        // world: 5 - restrict write permissions in world

        const userId = response['user']._id;

        if (!userId && !request.body.path) { // && !folderData.data.userName
            return response.status(400).json({ message: "The request was invalid" });
        }

        const directory: string = path.join(userId, request.body.path);
        const cwd: string = path.join(__dirname, 'repository', directory, request.body.data.FolderName);
        const folderData: any = request.body;

        let permission: number = 0o755;

        try {
            if (fs.existsSync(cwd)) {
                return response.status(409).json({ message: "This folder name already exists" })
            }
            else {

                if (folderData.data.Accessibility === 1) {

                    //let name: string = folderData.data.FolderName.replace(/ /g, '-');

                    const folder: IPublicShare = {
                        UserId: folderData.id,
                        Path: directory,
                        Type: folderData.data.Type,
                        ShareName: folderData.data.FolderName,
                        UserName: folderData.userName,
                        Invitees: folderData.data.Invitees,
                        Files: null,
                        CreatedOn: new Date(),
                        EditedOn: new Date()
                        //uri: `/${folderData.data.userName}/${name}`
                    }

                    const sharedFolder = await sharedFolderModel.create(folder);
                    console.log(sharedFolder);
                }

                fs.mkdirSync(cwd, permission);
                this.getFolderContents(request, response, directory);
            }
        } catch (error) {
            return response.status(500).json({ message: error });
        }

    }


    @Post('upload')
    @Middleware(JwtInterceptor.checkJWTToken)
    private uploadFile(request: Request, response: Response): void {

        const userId = response['user']._id;
        const file = request.files[0];

        if (!file) {
            response.status(404).json({ message: "No Files were present during upload" })
        }

        async.parallel([
            (callback: any) => {

                const uploads = path.resolve(file.path);

                fs.readFile(uploads, (error: any, data: any) => {
                    if (error) {
                        response.status(500).json({ message: "An error occured when reading the file from the uploads folder", error: error });
                    }
                    else {
                        callback(null, data);
                    }
                });

            }
        ],

        (err: any, result: any) => {

            const cwd = path.join(__dirname, 'repository', userId, request.body.path, file.originalname);

            fs.writeFile(cwd, result[0].value, (error: any) => {
                if (error) {
                    response.status(500).json({ message: "An error occured when writing the file to the folder", error: error });
                }
                else {
                    const filename = file.originalname.replace(/ /g, '\\\ ');
                    const command = `rm -rf ./uploads/${filename}`;
                    cmd.run(command);
                    response.status(204).end();
                }
            })
        })
    }


    @Post('delete')
    @Middleware(JwtInterceptor.checkJWTToken)
    private deleteItem(request: Request, response: Response): Response | void {

        const files = request.body.items;

        const userId = response['user']._id;

        if (!files) {
            return response.status(400).json({ message: "Bad Request" });
        }

        const folder = path.join(userId, request.body.path);

        try {
            async.each(files, async (file: any, callback: any) => {

                const directory = path.join(request.body.path, file);

                const cwd = path.join(__dirname, 'repository', userId, directory);

                const share = await this.validateShareUri(file);

                if (share.status) {
                    await sharedFolderModel.deleteOne({ _id: userId });
                }

                if (fs.lstatSync(cwd).isDirectory()) {

                    fs.remove(cwd, (error: any) => {
                        if (error) {
                            return response.status(500).json({ error: error })
                        }
                        else {
                            callback();
                        }
                    })
                }
                else {
                    fs.unlink(cwd, (error: any) => {
                        if (error) {
                            return response.status(500).json({ error: error })
                        } else {
                            callback();
                        }
                    })
                }
            },
            (error: any) => {
                if (error) {
                    return response.status(500).json({ error: error })
                } else {

                    //this.getFolderContents(request, response, folder);
                    return response.status(201).json({ message: "Delete Operation Successful" });
                }
            })
        } catch (error) {
            return response.status(500).json({ message: error });
        }

        
    }

    @Get('download')
    // @Middleware(JwtInterceptor.checkJWTToken)
    private downloadItem(request: Request, response: Response, next: NextFunction) {

        const dir = path.join(__dirname, 'repository', request.query.id, request.query.path, request.query.resource);

        const mimeType = mime.getType(request.query.resource);

        response.setHeader('Content-Type', mimeType);
        response.setHeader('Content-Transfer-Encoding', 'binary');
        response.setHeader('Content-disposition', `attachment; filename=${request.query.resource}`);

        response.download(dir);
                
    }

    @Post('verify')
    private verifyLink(request: Request, response: Response) {

        const shareName = request.body.shareName;
        const userName = request.body.userName;

        this.validateShareUri(shareName, userName).then((share: any) => {
            if (share.status) {
                const folder = path.join(share.data.UserId, share.data.ShareName);

                response['user']._id = share.data.UserId;

                this.getFolderContents(request, response, folder)
            }
            else {
                return response.status(404).json({ message: "We could not find the resource you specified" })
            }
        })
        .catch(error => {
            return response.status(500).json({ message: error });
        });
        
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