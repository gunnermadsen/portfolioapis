import * as express from 'express';
import { Request, Response } from 'express';
import * as multer from 'multer';

import { UserService } from '../services/user-service.controller';

import * as fsController from './repo';

const upload = multer({ dest: 'uploads/' });

let jwt = require('express-jwt');

const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

const router = express.Router();

router.post('/login', (request: Request, response: Response, next: any) => {
    UserService.login(request, response)
        .then(user => {
            return user ? response.status(200).json({ token: user.token }) : response.status(400).json({ message: "username or password is incorrect" });
            //response.status(200).json({id: user.id, email: user.email})
        })
        .catch(err => next(err));
});

router.post('/register', (request: Request, response: Response, next: any) => {
    UserService.create(request.body)
        .then(users => {
            return response.json({ message: "Your Account Was Created Successfully", status: 200 });
        })
        .catch(err => {
            return next(err);
        });
});

router.get('/', (request: Request, response: Response, next: any) => {
    UserService.getAll()
        .then(users => response.json(users))
        .catch(err => next(err));
});

router.get('/current', (request: Request, response: Response, next: any) => {
    UserService.getById(request.body.sub)
        .then(users => response.json(users))
        .catch(err => next(err));
});

router.get('/:id', (request: Request, response: Response, next: any) => {
    UserService.getById(request.params.id)
        .then(user => user ? response.json(user) : response.sendStatus(404))
        .catch(err => next(err));
})

router.put('/:id', (request: Request, response: Response, next: any) => {
    UserService.update(request.params.id, request.body)
        .then(() => response.json({}))
        .catch(err => next(err));
})

router.delete('/:id', (request: Request, response: Response, next: any) => {
    UserService.delete(request.params.id)
        .then(() => response.json({}))
        .catch(err => next(err));
});

//router.get("/:folder*?", fsController.readFolder);

router.post("/repo", upload.any(), (request: Request, response: Response, next: Function) => {
    if (request.files) {
        fsController.upload(request, response);
    } else {
        next();
    }
});

//router.post("/:folder*?/:data*?", fsController.createFolder);

module.exports = router;