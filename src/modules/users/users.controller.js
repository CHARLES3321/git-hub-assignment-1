import * as userService from './users.service.js';
import {asyncWrapper} from "../../common/utils.js";
import {sendSuccess} from "../../common/middlename/response.interceptor.js";

export const getAllUsers = asyncWrapper(async (req, res, next) => {
    const params = req.params;
    const users = await userService.getAllUsers(params);

    sendSuccess(req, users);
})

export const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    sendSuccess(req, {}, 'User deleted successfully.', 204);
})