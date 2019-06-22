import * as express from 'express';
import { Request, Response } from 'express';
import * as multer from 'multer';

import * as fsController from '../controllers/coolshare/repo';

const router = express.Router();


const upload = multer({ dest: 'uploads/' });

//router.get("/:folder*?", fsController.readFolder);

router.post("/repo", upload.any(), (request: Request, response: Response, next: Function) => {
    if (request.files) {
        fsController.upload(request, response);
    } else {
        next();
    }
});

//router.post("/:folder*?/:data*?", fsController.createFolder);