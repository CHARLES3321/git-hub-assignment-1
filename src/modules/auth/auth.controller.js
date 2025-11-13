import * as authService from './auth.service.js';
import {asyncWrapper} from "../../common/utils.js";
import {sendSuccess} from "../../common/middlename/response.interceptor.js";
import {signUpSchema} from "./auth.schema.js";
import {ValidationError} from "../../common/error-definition.js";

export const signIn = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const token = await authService.signIn({email, password});

    sendSuccess(res, {
        access_token: token,
        type:  'Bearer'
    })
})

export const signUp = asyncWrapper(async (req, res) => {
    const results = signUpSchema.safeParse(req.body);
    if(!results.success) throw new ValidationError("The request failed with the following errors", results.error);
    const user = await authService.signUp(results.data);

    sendSuccess(res, user, "User registration successful.", 201)
})

export const getAuthUser = asyncWrapper(async  (req, res) => {
    const user = await authService.getUser(req.user.id);
    if (!user) {}
    sendSuccess(res, user);
})