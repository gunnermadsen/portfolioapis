import { Request, Response, response } from 'express';
import { User } from '../models/authentication.model';
import * as bcrypt from 'bcrypt';

const UserModel = new User().getModelForClass(User);

export {
    login,
    getAll,
    getById,
    create,
    update,
    _delete as delete
}

async function login(request: Request, response: Response) {

    const username = request.body.username;
    const password = request.body.password;

    const user = await UserModel.findOne({ username });
    const isValid = await user.validatePassword(password);

    if (user && isValid) {

        const { hash, ...userWithoutHash } = user.toObject();
        const token = await user.generateSessionToken(user.id);

        //response.cookie("SESSIONID", token, { maxAge: 3600000, httpOnly: true, secure: false});

        return {
            ...userWithoutHash,
            token
        }
    }

}

async function getAll() {
    return await UserModel.find().select('-hash');
}

async function getById(id: string) {
    return await UserModel.findById(id).select('-hash');
}

async function create(userParams: any) {
    if (await UserModel.findOne({ username: userParams.username })) {
        throw 'Username "' + userParams.username + '" is already taken';
    }

    const user = new UserModel(userParams);

    if (userParams.password) {
        //user.hash = bcrypt.hashSync(userParams.password, 10);
        user.hash = user.setPassword(userParams.password);
    }

    await user.save()
}

async function update(id: string, userParams: any) {
    const user = await UserModel.findById(id);

    if (!user) throw 'User not found';

    if (user.username !== userParams.username && await UserModel.findOne({ username: userParams.username })) {
        throw 'Username "' + userParams.username + '" is already taken';
    }

    if (userParams.password) {
        userParams.hash = bcrypt.hashSync(userParams.password, 10);
    }

    Object.assign(user, userParams);

    await user.save();
}

async function _delete(id: string) {
    await UserModel.findByIdAndRemove(id);
}