import { Request, Response } from 'express';
import * as multer from 'multer';
import * as cmd from 'node-cmd';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as async from 'async';

import { Controller, Get, Post, Put, Delete, ClassMiddleware, Middleware } from '@overnightjs/core';
import * as path from 'path';
import { JwtInterceptor } from './middleware/jwt.interceptor';

@Controller('api/repo')
@ClassMiddleware(JwtInterceptor.checkJWTToken)
export class RepositoryController {

    @Post('') //:folder*?
    private getFolderContents(request: Request, response: Response, readPath?: any) {

        let results: any[] = [];
        let urn: string = request.body.path;
        let filePath: string;
        let cwd: string;
        // var dir = (request.path === "/") ? '/repo' : request.path;

        if (readPath && typeof readPath === 'string') {
            cwd = path.join(__dirname, 'repository', request.body.id, readPath)
        } else{
            cwd = path.join(__dirname, 'repository', request.body.id, urn);
        }


        fs.readdir(cwd, (error: any, list: any) => {

            if (error) {
                return response.status(404).json({ message: error })
            }

            if (list.length == 0) {
                const name = "No Contents to Display";
                let cwd = request.body.path.split('/');
                cwd = '/' + cwd[cwd.length - 1];
                results.push({
                    id: crypto.createHash('md5').update(name).digest('hex'),
                    name: name,
                    cwd: (typeof readPath === 'string') ? readPath : path.join(request.body.path),
                    empty: true,
                    path: path.join(request.body.path, '/')
                });
                return response.status(200).json(results);
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
                        cwd: path.join(request.body.path),
                        empty: false,
                        //absPath: path.join('/', dir),
                        path: path.join(request.body.path, list[index]),
                        // branch: dir.split("/"),
                        // parent: dir.replace(/[^\/]*$/, '').slice(0, -1),
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

        const directory = path.join(request.body.path, request.body.data.FolderName)

        const cwd = path.join(__dirname, 'repository', request.body.id, directory);

        fs.exists(cwd, (exists: Boolean) => {
            if (exists) {
                return response.status(409).json({ message: "This folder name already exists" })
            } 
            else {
                //-rwxr-xr-x
                // owner: 7 - unlimited execution permissions as directory owner
                // group: 5 - restrict write permissions in group
                // world: 5 - restrict write permissions in world
                fs.mkdirSync(cwd, 0o755);
                this.getFolderContents(request, response, directory);
            }
        })
    }


    @Post('upload')
    private uploadFile(request: Request, response: Response) {

        const files = request.files;

        if (!files) {
            return response.status(404).json({ message: "No Files were present during upload" })
        }


        async.each(files, (file: any, eachCallback: any) => {
            async.waterfall(
                [
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

                    (data: any, callback: any) => {

                        const cwd = path.join(__dirname, 'repository', request.body.id, request.body.path, file.originalname);

                        fs.writeFile(cwd, data, (err: any) => {
                            if (err) {
                                return response.status(500).json(err);
                            } 
                            else {
                                callback(null, data);
                            }
                        });

                    }

                ],

                (err: any, result: any) => {
                    eachCallback();
                }

            )
        }, 
        (err: any) => {
            if (err) {
                return response.status(500).json(err);
            } 
            else {
                cmd.run('rm -rf ./uploads/*');
                this.getFolderContents(request, response);
            }
        });
    }

}