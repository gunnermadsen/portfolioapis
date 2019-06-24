// import * as express from 'express';
// import { Express, Request, Response, NextFunction } from 'express';
// import { UserController } from '../src/controllers/authentication/authentication.controller';
// let jwt = require('express-jwt');
// const auth = jwt({
//     secret: process.env.JWT_SECRET,
//     userProperty: 'payload'
// });
// const router = express.Router();
// const userController = new UserController();
// router.post('/login', (request: Request, response: Response, next: any) => {
//     userController.login(request, response)
//         .then(user => {
//             return response.status(200).json({
//                 token: user.token,
//                 userName: user.UserName
//             })
//         })
//         .catch(err => {
//             return response.status(401).json({ message: err });
//         });
// });
// router.post('/register', (request: Request, response: Response, next: any) => {
//     userController.create(request.body)
//         .then(users => {
//             return response.json({ message: "Your Account Was Created Successfully", status: 200 });
//         })
//         .catch(err => {
//             return next(err);
//         });
// });
// router.get('/', (request: Request, response: Response, next: any) => {
//     userController.getAll()
//         .then(users => response.json(users))
//         .catch(err => next(err));
// });
// router.get('/current', (request: Request, response: Response, next: any) => {
//     userController.getById(request.body.sub)
//         .then(users => response.json(users))
//         .catch(err => next(err));
// });
// router.get('/:id', (request: Request, response: Response, next: any) => {
//     userController.getById(request.params.id)
//         .then(user => user ? response.json(user) : response.sendStatus(404))
//         .catch(err => next(err));
// })
// router.put('/:id', (request: Request, response: Response, next: any) => {
//     userController.update(request.params.id, request.body)
//         .then(() => response.json({}))
//         .catch(err => next(err));
// })
// router.delete('/:id', (request: Request, response: Response, next: any) => {
//     userController.delete(request.params.id)
//         .then(() => response.json({}))
//         .catch(err => next(err));
// });
// export default router;