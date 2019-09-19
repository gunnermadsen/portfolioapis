import { Request, Response, response } from 'express';

import * as cmd from 'node-cmd';
import * as fs from 'fs-extra';
import * as nodefs from 'fs';
import * as crypto from 'crypto';
import * as async from 'async';
import * as path from 'path';
import * as mime from 'mime';
import * as quicklookThumbnail from 'quicklook-thumbnail';
import * as prettyIcon from 'pretty-file-icons'

import { convertFile } from 'convert-svg-to-png'


import { Controller, Post, ClassMiddleware, Middleware, Get } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import { SharedFolders } from '../../models/shared-folder.model';
import { Files, IFiles } from '../../models/files.model';


export class FileSystemController {
    @Post('') //:folder*?
    @Middleware(JwtInterceptor.checkJWTToken)
    private getFolderContents(request: Request, response: Response, readPath?: any) {

        let results: any[] = [];

        let server = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'

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

                fs.stat(filePath, async (err: any, stat: any) => {

                    // let base = (!stat.isDirectory()) ? new Buffer(fs.readFileSync(path.join(cwd, file)).toString(), 'base64').toString('ascii') : false;

                    if (error) {
                        return response.status(404).json({ message: err })
                    }

                    let pathName = request.body.path ? request.body.path : request.body.shareName;
                    let userName = request.body.userName ? request.body.userName : null;

                    let resource = userName ? pathName : file;
                    let iconPath: string = ""

                    const sharedStatus = await this.validateShareUri(resource, userName) //.then((status: any) => sharedStatus = status);

                    let fileName = path.parse(file).name
                    let thumbnailPath = `${server}/${userId}/${fileName}`

                    iconPath = sharedStatus.status ? `${server}/shared-folder.png` : `${server}/folder.png`

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
                        thumbnail: (stat.isDirectory()) ? iconPath : `${thumbnailPath}.png`
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
}