import { Request, Response, response } from 'express';
import * as multer from 'multer';
import * as cmd from 'node-cmd';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as async from 'async';

import { Controller, Post, ClassMiddleware, Middleware } from '@overnightjs/core';
import * as path from 'path';
import { JwtInterceptor } from './middleware/jwt.interceptor';
import { SharedFolders } from '../../models/shared-folder.model';

const sharedFolderModel = new SharedFolders().getModelForClass(SharedFolders);


@Controller('api/repo')
// @ClassMiddleware(JwtInterceptor.checkJWTToken)
export class RepositoryController {


    @Post('') //:folder*?
    @Middleware(JwtInterceptor.checkJWTToken)
    private getFolderContents(request: Request, response: Response, readPath?: any, userId?: any) {

        let results: any[] = [];

        let urn: string = request.body.path;
        let filePath: string;
        let cwd: string;

        if (readPath && typeof readPath === 'string') {
            cwd = path.join(__dirname, 'repository', readPath)
        } else{
            cwd = path.join(__dirname, 'repository', request.body.id, urn);
        }


        fs.readdir(cwd, (error: any, list: any[]) => {

            if (error) {
                return response.status(404).json({ message: error })
            }

            if (list.length == 0) {

                const name = "No Contents to Display";
                let id: string = (userId) ? userId : request.body.id;

                results.push({
                    id: crypto.createHash('md5').update(name).digest('hex'),
                    name: name,
                    cwd: (typeof readPath === 'string') ? readPath : path.join(request.body.path),
                    empty: true,
                    // path: path.join(request.body.path, '/')
                });

                return response.status(200).json({ content: results, userId: id });
            }

            let pending = list.length;

            if (!pending) {
                return response.status(201).json(results);
            }

            list.forEach((file: string, index: number) => {

                filePath = path.resolve(cwd, file);

                fs.stat(filePath, async (err: any, stat: any): Promise<Response> => {

                    if (error) {
                        return response.status(404).json({ message: err })
                    }

                    const sharedStatus = await this.getSharedStatus(file);

                    results.push({
                        id: crypto.createHash('md5').update(file).digest('hex'),
                        index: index,
                        name: file,
                        type: (stat.isDirectory()) ? "Folder" : "File",
                        size: stat.size + " Bytes",
                        creationDate: stat.birthtime,
                        cwd: path.join(request.body.path),
                        empty: false,
                        isShared: sharedStatus.status,
                        //absPath: path.join('/', dir),
                        path: path.join(request.body.path, list[index]),
                        // branch: dir.split("/"),
                        // parent: dir.replace(/[^\/]*$/, '').slice(0, -1),
                    });

                    if (!--pending) {
                        return response.status(200).json({ content: results, userId: request.body.id });
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

        if (!request.body.id && !request.body.path) { // && !folderData.data.userName
            return response.status(400).json({ message: "The request was invalid" });
        }

        const directory = path.join(request.body.id, request.body.path);
        const cwd = path.join(__dirname, 'repository', directory, request.body.data.FolderName);
        const folderData = request.body;

        let permission: number = 0o755;

        try {
            if (fs.existsSync(cwd)) {
                return response.status(409).json({ message: "This folder name already exists" })
            }
            else {

                if (folderData.data.Accessibility === 1) {

                    //let name: string = folderData.data.FolderName.replace(/ /g, '-');

                    const folder: Object = {
                        userId: folderData.id,
                        path: directory,
                        name: folderData.data.FolderName,
                        invitees: folderData.data.Invitees,
                        files: null,
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
    private uploadFile(request: Request, response: Response): Response {

        const file = request.files[0];

        if (!file) {
            return response.status(404).json({ message: "No Files were present during upload" })
        }

        async.parallel([
            (callback: any) => {

                fs.readFile(file.path, (err: any, data: any) => {
                    if (err) {
                        return response.status(500).json(err);
                    }
                    else {
                        callback(null, data);
                    }
                });
            },

            (callback: any) => {

                const cwd = path.join(__dirname, 'repository', request.body.id, request.body.path, file.originalname);

                fs.writeFile(cwd, file, (err: any) => {
                    if (err) {
                        return response.status(500).json(err);
                    }
                    else {
                        callback(null, file);
                    }
                });

            }

        ],

        (err: any, result: any) => {

            if (err) {
                return response.status(500).json(err);
            }
            else {
                cmd.run('rm -rf ./uploads/*');
                return response.status(200).json({ message: "File Upload Successful" })
            }
        })
    }


    @Post('delete')
    @Middleware(JwtInterceptor.checkJWTToken)
    private deleteItem(request: Request, response: Response): Response | void {

        const files = request.body.items;

        if (!files) {
            return response.status(400).json({ message: "Bad Request" });
        }

        const folder = path.join(request.body.id, request.body.path);

        async.each(files, (file: any, callback: any) => {

            const directory = path.join(request.body.path, file);

            const cwd = path.join(__dirname, 'repository', request.body.id, directory);

            fs.unlink(cwd, (error: any) => {
                if (error) {
                    return response.status(500).json({ error: error })
                } else {
                    callback();
                }
            })
        },
        (error: any) => {
            if (error) {
                return response.status(500).json({ error: error })
            } else {
                
                this.getFolderContents(request, response, folder);
            }
        })
    }

    @Post('download')
    @Middleware(JwtInterceptor.checkJWTToken)
    private downloadItem(request: Request, response: Response) {

        if (request.body.name && request.body.id && request.body.path) {
            const file = path.join(__dirname, 'repository', request.body.id, request.body.path, request.body.name);
    
            response.sendFile(file);
        } else {
            response.status(404).json({ message: 'The resource you requested could not be found', status: 404 })
        }
    }

    @Post('verify')
    private verifyLink(request: Request, response: Response) {
        const uri = request.body.uri;

        this.getSharedStatus(uri).then((share: any) => {
            if (share.status) {
                const folder = path.join(share.data.userId, share.data.name);

                this.getFolderContents(request, response, folder, share.data.userId)
            }
            else {
                return response.status(404).json({ message: "We could not find the resource you specified" })
            }
        }).catch(error => {
            return response.status(500).json({ message: error });
        });
        
    }

    private async getSharedStatus(name: string): Promise<any> {

        const share = await sharedFolderModel.findOne({ name: name });

        const result: any = {
            data: share,
            status: (share) ? true : false
        }
        
        return result;

    }

}