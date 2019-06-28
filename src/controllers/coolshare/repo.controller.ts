import { Request, Response } from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as async from 'async';

// import { OK, BAD_requestUEST } from 'http-status-codes';

import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import * as path from 'path';
import { JwtInterceptor } from './middleware/jwt.interceptor';

const upload = multer({ dest: 'uploads/' });


@Controller('api/repo')
@ClassMiddleware(JwtInterceptor.checkJWTToken)
export class RepositoryController {

    @Post('') //:folder*?
    private getFolderContents(request: Request, response: Response) {

        let results: any[] = [];
        let filePath;

        var dir = (request.path === "/") ? '/repo' : request.path;

        const cwd = path.join(__dirname, 'repository', request.body.id, request.body.path);

        fs.readdir(cwd, (error: any, list: any) => {

            if (error) {
                return response.status(404).json({ message: error })
            }

            if (list.length == 0) {
                results.push({
                    name: "No Contents to Display",
                    cwd: dir.substring(dir.lastIndexOf("/") + 1),
                    parent: dir.replace(/[^\/]*$/, '').slice(0, -1),
                    empty: true
                });
                return response.status(201).json(results);
            }

            var pending = list.length;

            if (!pending) {
                return response.status(201).json(results);
            }

            list.forEach((file: any, index: number) => {

                filePath = path.resolve(cwd, file);

                fs.stat(filePath, (err: any, stat: any) => {

                    if (error) {
                        return response.status(404).json({ message: err })
                    }

                    results.push({
                        id: crypto.createHash('md5').update(file).digest('hex'),
                        name: file,
                        type: (stat.isDirectory()) ? "Folder" : "File",
                        size: stat.size + " Bytes",
                        creationDate: stat.birthtime,
                        cwd: '/' + dir.substring(dir.lastIndexOf("/") + 1),
                        absPath: path.join('/', dir),
                        path: path.join('/', dir, list[index]),
                        branch: dir.split("/"),
                        parent: dir.replace(/[^\/]*$/, '').slice(0, -1),
                    });

                    if (!--pending) {
                        return response.status(200).json(results);
                    }
                    
                });
            });
        });    
    }


    @Post('create') // /:folder*?/:data*?
    private createNewFolder(request: Request, response: Response, id: string) {
        var cwd = path.join(__dirname, request.path, request.body.name);
        // req.body.name, req.path
        if (!fs.existsSync(cwd)) {
            //-rwxr-xr-x
            // owner: 7 - unlimited permissions as dir owner
            // group: 5 - limited write permissions in group
            // world: 5 - limited write permissions in world
            fs.mkdirSync(cwd, 0o755);
        }
        this.getFolderContents(request, response);
    }


    @Post('/')
    private uploadFile(request: Request, response: Response) {

        var files = request.files;

        async.each(files, (file: any, eachCallback: any) => {
            async.waterfall(
                [
                    (callback: any) => {
                        fs.readFile(file.path, (err: any, data: any) => {
                            if (err) {
                                return response.status(500).json(err);
                            } else {
                                callback(null, data);
                            }
                        });
                    },

                    (data: any, callback: any) => {
                        var writepath = path.join(__dirname, request.body.path);

                        //var fname = filename;

                        fs.writeFile(writepath + '/' + file.originalname, data, (err: any) => {
                            if (err) {
                                return response.status(500).json(err);
                            } else {
                                callback(null, data);
                            }
                        });
                    }
                ],

                (err: any, result: any) => {
                    eachCallback();
                })
        }, (err: any) => {
            if (err) {
                return response.status(500).json(err);
            } else {
                //cmd.run('rm -rf ./uploads');
                this.getFolderContents(request, response);
                //return sendJSONResponse(res, 201, { "message": "File upload successful" });
            }
        });
    }

}