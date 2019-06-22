import { Request, Response, response } from 'express';
import { User } from '../../models/authentication.model';
import * as bcrypt from 'bcrypt';

const UserModel = new User().getModelForClass(User);

export class UserController {
    constructor() {}

    public static async login(request: Request, response: Response) {

        const UserName = request.body.UserName;
        const Password = request.body.Password;

        const user = await UserModel.findOne({ UserName });
        const hash = await user.validatePassword(Password);

        if (user.Hash === hash && user.UserName === UserName) {

            const { hash, ...userWithoutHash } = user.toObject();
            const token = await user.generateSessionToken(user.id);

            response.cookie("SESSIONID", token, { maxAge: 3600000, httpOnly: true, secure: false});

            return {
                ...userWithoutHash,
                token
            }
        } else {
            throw { message: 'Your username or password is incorrect' };
        }
    }

    public static async getAll() {
        return await UserModel.find().select('-hash');
    }

    public static async getById(id: string) {
        return await UserModel.findById(id).select('-hash');
    }

    public static async create(userParams: any) {
        if (await UserModel.findOne({ UserName: userParams.UserName })) {
            throw userParams.UserName + ' is already taken';
        }

        const user = new UserModel(userParams);

        if (userParams.Password) {
            //user.hash = bcrypt.hashSync(userParams.password, 10);
            user.Hash = user.setPassword(userParams.Password);
        }

        await user.save()
    }

    public static async update(id: string, userParams: any) {
        const user = await UserModel.findById(id);

        if (!user) throw 'User not found';

        if (user.UserName !== userParams.UserName && await UserModel.findOne({ UserName: userParams.UserName })) {
            throw + userParams.UserName + ' is already taken';
        }

        if (userParams.password) {
            userParams.hash = bcrypt.hashSync(userParams.password, 10);
        }

        Object.assign(user, userParams);

        await user.save();
    }

    public static async delete(id: string) {
        await UserModel.findByIdAndRemove(id);
    }

}