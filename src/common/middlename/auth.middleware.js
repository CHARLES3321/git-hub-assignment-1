import jwt from 'jsonwebtoken';
import {sendForbidden} from "./response.interceptor.js";
import {ForbiddenError} from "../error-definition.js";

import {getOrThrowEnvKey} from "../../config/config.js";


export const checkToken = (req, res, next) => {
    try {
        const authorizationToken = req.headers['authorization']?.split(' ')[1];
        if(!authorizationToken) throw new ForbiddenError('Invalid token or no token provided');
        const payload = jwt.verify(authorizationToken, getOrThrowEnvKey('JWT_SECRET_KEY'));
        req.user = payload;
        next();
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

export const checkUserRole = (...roles) => {
    return (req, res, next) => {
        const role = req.user.role;
        if(!roles.includes(role)) throw new ForbiddenError('You are not authorized to make this request');
        next();
    }
}