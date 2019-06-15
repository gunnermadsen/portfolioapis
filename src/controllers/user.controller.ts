import * as express from 'express';
import { Request, Response } from 'express';
import * as userService from '../services/user-service.controller';
import * as multer from 'multer';

import * as fsController from './repo';

const upload = multer({ dest: 'uploads/' });

let jwt = require('express-jwt');

const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

const router = express.Router();


router.post('/users/login', (request: Request, response: Response, next: any) => {
    userService.login(request, response)
        .then(user => {
            return user ? response.status(200).json({ token: user.token }) : response.status(400).json({ message: "username or password is incorrect" });
            //response.status(200).json({id: user.id, email: user.email})
        })
        .catch(err => next(err));
});

router.post('/users/register', (request: Request, response: Response, next: any) => {
    userService.create(request.body)
        .then(users => {
            return response.json({ message: "Your Account Was Created Successfully", status: 200 });
        })
        .catch(err => {
            return next(err);
        });
});

router.get('/', (request: Request, response: Response, next: any) => {
    userService.getAll()
        .then(users => response.json(users))
        .catch(err => next(err));
});

router.get('/current', (request: Request, response: Response, next: any) => {
    userService.getById(request.body.sub)
        .then(users => response.json(users))
        .catch(err => next(err));
});

router.get('/:id', (request: Request, response: Response, next: any) => {
    userService.getById(request.params.id)
        .then(user => user ? response.json(user) : response.sendStatus(404))
        .catch(err => next(err));
})

router.put('/:id', (request: Request, response: Response, next: any) => {
    userService.update(request.params.id, request.body)
        .then(() => response.json({}))
        .catch(err => next(err));
})

router.delete('/:id', (request: Request, response: Response, next: any) => {
    userService.delete(request.params.id)
        .then(() => response.json({}))
        .catch(err => next(err));
});

//router.get("/:folder*?", fsController.readFolder);

router.post("/repo", upload.any(), function (req, res, next) {
    if (req.files) {
        fsController.upload(req, res);
    } else {
        next();
    }
});

//router.post("/:folder*?/:data*?", fsController.createFolder);

module.exports = router;