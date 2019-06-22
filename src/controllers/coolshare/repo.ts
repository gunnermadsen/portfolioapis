/* jshint esversion: 6 */
const fs = require('fs');
const path = require('path'); 
const async = require('async');
//const cmd = require('node-cmd');
const crypto = require('crypto');

/** notes about the request object
 *  req.query values originate from parameters set in the url: 
 *      e.g. : http://somedomain.com/home?fname=gunner&lname=madsen
 *           - fname = "gunner"
 *           - lname = "madsen"
 *  req.params values originaate from the path segments in the url 
 *  that match parameters in the route definition. 
 *      e.g  : http://somedomain.com/home/123/gunner/5 
 *           - where 123, and 5 correspond to route parameters such as: 
 *              - :id = 123
 *              - :userId = 5
 *  req.body values originate from form post and are stored in the http request body
 **/

export function readFolder(req: any, res: any) {
    //sendJSONResponse(res, 201, {"message": "operation successful"});

    let results: any[] = [];
    let filePath;

    var dir = (req.path === "/") ? '/repo' : req.path;

    var cwd = path.join(__dirname, dir);

    fs.readdir(cwd, (err: any, list: any) => {

        if (list.length == 0) {
            results.push({
                name: "No Contents to Display",
                cwd: dir.substring(dir.lastIndexOf("/") + 1),
                parent: dir.replace(/[^\/]*$/, '').slice(0, -1),
                empty: true
            });
            return res.status(201).json(results);            
        }

        var pending = list.length;

        if (!pending) res.status(201).json(results);

        list.forEach((file: any, index: number) => {

            filePath = path.resolve(cwd, file);

            fs.stat(filePath, (err: any, stat: any) => {

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
                    selected: false,
                    temp: ""
                });

                if (!--pending) res.status(201).json(results);
            });
        });
    });    
};

export function createFolder(req: any, res: any) {

    var cwd = path.join(__dirname, req.path, req.body.name);
    // req.body.name, req.path
    if (!fs.existsSync(cwd)) {
        //-rwxr-xr-x
        // owner: 7 - unlimited permissions as dir owner
        // group: 5 - limited write permissions in group
        // world: 5 - limited write permissions in world
        fs.mkdirSync(cwd, 0o755);
    } 
    module.exports.readFolder(req, res);
};

export function upload(req: any, res: any) {

    var files = req.files;

    async.each(files, (file: any, eachCallback: any) => {
        async.waterfall(
        [
            (callback: any) => {
                fs.readFile(file.path, (err: any, data: any) => {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        callback(null, data);
                    }
                });
            }, 
            
             (data: any, callback: any) => {
                var writepath = path.join(__dirname, req.body.path);
                
                //var fname = filename;

                watchFileChanges(writepath, file);

                fs.writeFile(writepath + '/' + file.originalname, data, (err: any) => {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        callback(null, data);
                    }
                });
            }
        ], 

        (err: any, result: any) => {
            eachCallback();
        }, 
        
         (err: any) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                console.log("success");
            }
        });

    }, (err: any) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            //cmd.run('rm -rf ./uploads');
            module.exports.readFolder(req, res);
            //return sendJSONResponse(res, 201, { "message": "File upload successful" });
        }
    });
};

export function watchFileChanges (path: any, file: any) {
    fs.watchFile(path + '/' + file.originalname, (eventType: any, filename: any) => {
        
    });
}