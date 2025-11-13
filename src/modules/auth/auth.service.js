import * as userService from '../users/users.service.js';
import jwt from 'jsonwebtoken';
import {comparePassword} from "../../common/utils.js";
import {AuthenticationError, ConflictError, NotFoundError} from "../../common/error-definition.js";
import {getOrThrowEnvKey} from "../../config/config.js";


export const signUp = async (payload) => {
    const user  = await userService.getUserByEmail(payload.email);
    if(user) throw new ConflictError('This email has been taken');
    const {password, ...details } = await userService.createUser(payload);
    return details;
}

export const signIn = async (payload) => {
    const user = await userService.getUserByEmail(payload.email);
    if(!user) throw new NotFoundError('Invalid email or password');
    if(!(await comparePassword(payload.password, user.password))) throw new AuthenticationError('Invalid email or password');
    delete user.password;
    const token = jwt.sign({
        ...user,
        id: user._id
    },
        // gets the secret key used to sign the JWT, if the key is missing it throws an error.
        getOrThrowEnvKey('JWT_SECRET_KEY'),  {
        // gets the time the token should last, it throws an error if the values isn't set
        expiresIn: getOrThrowEnvKey('JWT_EXPIRY')



    });
    return token;
}

export const getUser = async (id) => {
    const user = await userService.getUserById(id);
    if(!user) return null;
    delete user.password;
    return user;
}